// pages/api/sign/[slug].js
import AgreementPDF from "../../../components/pdf/AgreementPDF";
import { query } from "../../../lib/db";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { pdf } from "@react-pdf/renderer";
import { buildReadableFilename } from "../../../lib/filename";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
    api: {
        // keep Next.js bodyParser ON (default). It parses JSON  x-www-form-urlencoded.
        bodyParser: { sizeLimit: "1mb" },
    },
};

// Fallback only if req.body is empty (rare)
async function parseBodyIfNeeded(req) {
    if (
        req.body &&
        typeof req.body === "object" &&
        Object.keys(req.body).length > 0
    ) {
        console.log("Using req.body from Next parser");
        return req.body;
    }
    console.log("Falling back to manual body parse…");
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    console.log("Raw length:", raw.length);
    const ct = req.headers["content-type"] || "";
    if (ct.includes("application/json")) {
        try {
            return JSON.parse(raw || "{}");
        } catch {
            return {};
        }
    }
    if (ct.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(raw);
        const o = {};
        for (const [k, v] of params) o[k] = v;
        return o;
    }
    return {};
}

export default async function handler(req, res) {
    console.log("--- SIGN API START ---");
    console.log("Method:", req.method);
    console.log("Slug param:", req.query.slug);
    console.log("Content-Type:", req.headers["content-type"]);

    if (req.method !== "POST") return res.status(405).end();

    const { slug } = req.query;

    console.log("Querying for agreement…");
    const { rows } = await query(
        `select * from "Agreement" where slug=$1 and "isActive"=true`,
        [slug]
    );
    console.log("Agreement rows:", rows.length);
    const agreement = rows[0];
    if (!agreement) {
        console.log("Agreement not found or inactive");
        return res.status(404).send("Agreement not found or disabled.");
    }

    console.log("Parsing body…");
    const body = await parseBodyIfNeeded(req);
    console.log("Parsed body keys:", Object.keys(body));

    const { artistName, artistEmail, date, consent } = body;
    if (!artistName || !artistEmail || !date || !consent) {
        console.log("Missing fields", {
            artistName: !!artistName,
            artistEmail: !!artistEmail,
            date: !!date,
            consent: !!consent,
        });
        return res.status(400).send("Missing fields.");
    }

    const ip = (
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        ""
    ).toString();
    const ua = req.headers["user-agent"] || "";
    console.log("IP:", ip);
    console.log("UA:", ua);

    const hash = crypto
        .createHash("sha256")
        .update(
            JSON.stringify({
                slug,
                artistName,
                artistEmail,
                date,
                ip,
                ua,
                t: Date.now(),
            })
        )
        .digest("hex");
    console.log("Hash:", hash.slice(0, 12) + "…");

    const signingId = crypto.randomUUID();
    console.log("Inserting signing:", signingId);

    await query(
        `with insert_signing as (
            insert into "Signing"(id,"agreementId","artistName","artistEmail","ipAddress","userAgent","pdfSha256","pdfPath")
            values ($1,$2,$3,$4,$5,$6,$7,$8)
            returning "agreementId"
        )
        update "Agreement"
        set "isActive" = false
        where id = (select "agreementId" from insert_signing)`,
        [signingId, agreement.id, artistName, artistEmail, ip, ua, hash, null]
    );

    // Generate pdf
    const instance = pdf(
        <AgreementPDF
            signerName={artistName}
            signedDate={new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
            tracks={agreement.tracks || []}
            sellerParty={agreement.sellerParty}
        />
    );

    const pdfBuffer = await instance.toBuffer();
    const filename = buildReadableFilename({
        agreementTitle: "Duetti", // from Agreement.title
        artistName: artistName,
        signedAt: date,
        signingId,
    });
    // const filename = `${slug}-${signingId}.pdf`;
    const path = `signed/${filename}`;

    const { error: uploadErr } = await supabase.storage
        .from("pdfs")
        .upload(path, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
            duplex: "half", // 👈 required in Node 18+
        });

    if (uploadErr) {
        console.error("Upload failed:", uploadErr);
    }

    // Get URL (public or signed)
    let pdfUrl;
    if (process.env.AGREEMENTS_BUCKET_PUBLIC === "true") {
        const { data } = supabase.storage.from("pdfs").getPublicUrl(path);
        pdfUrl = data?.publicUrl;
    } else {
        const { data } = await supabase.storage
            .from("pdfs")
            .createSignedUrl(path, 60 * 60);
        pdfUrl = data?.signedUrl;
    }

    // Update Signing row with pdf info
    await query(
        `update "Signing" set "pdfPath"=$1, "pdfSha256"=$2 where id=$3`,
        [path, hash, signingId]
    );

    console.log("Insert complete — sending response");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Signed</title>
        <style>body{font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding:3rem; background:#fafafa}</style>
      </head>
      <body>
        <h1>Thanks, ${escapeHtml(artistName)}!</h1>
        <p>Your agreement has been recorded.</p>
        <p>Reference: <code>${hash.slice(0, 12)}…</code></p>
         ${
             pdfUrl
                 ? `<p><a href="${pdfUrl}" target="_blank">Download PDF</a></p>`
                 : ""
         }

      </body>
    </html>
  `);
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
