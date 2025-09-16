// pages/api/admin/index.js
import { query } from "../../../../lib/db";
import crypto from "crypto";

// Coerce whatever comes in to an array of objects with at least { title }
function normalizeTracks(input) {
    if (!input) return [];
    if (!Array.isArray(input)) return [];

    return input
        .map((item) => {
            // string -> { title: string }
            if (typeof item === "string") {
                const title = item.trim();
                return title ? { title } : null;
            }

            // object -> keep known keys; coerce blank -> null
            if (item && typeof item === "object") {
                const title = (item.title ?? "").toString().trim();
                const isrc = toNullableString(item.isrc);
                const iswc = toNullableString(item.iswc);
                const proMlcId = toNullableString(item.proMlcId);
                const duettiCatalogId = toNullableString(item.duettiCatalogId);

                if (!title) return null; // require a title

                return { title, isrc, iswc, proMlcId, duettiCatalogId };
            }

            return null;
        })
        .filter(Boolean);
}

function toNullableString(v) {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s.length ? s : null;
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const {
                title,
                tracks = [],
                bodyTemplate,
                isActive = true,
                sellerParty,
            } = req.body || {};
            if (!bodyTemplate)
                return res.status(400).json({ error: "bodyTemplate required" });

            const id = crypto.randomUUID();
            const slug =
                crypto.randomUUID().slice(0, 8) +
                Math.random().toString(36).slice(2, 8);

            const normalizedTracks = normalizeTracks(tracks);

            // Optional: server-side sanity check to prevent giant payloads
            if (normalizedTracks.length > 500) {
                return res
                    .status(400)
                    .json({ error: "Too many tracks (max 500)." });
            }

            // Insert; ensure Postgres treats it as jsonb
            await query(
                `insert into "Agreement"(id, slug, title, tracks, "bodyTemplate", "isActive", "sellerParty")
         values ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
                [
                    id,
                    slug,
                    title || null,
                    JSON.stringify(normalizedTracks),
                    bodyTemplate,
                    !!isActive,
                    sellerParty,
                ]
            );

            res.json({ id, slug });
        } catch (e) {
            console.error("Admin create error:", e);
            res.status(400).json({ error: e?.message || "Invalid payload" });
        }
    } else if (req.method === "GET") {
        const r = await query(
            `select a.*, 
        (select count(*) from "Signing" s where s."agreementId" = a.id)::int as "signingCount",
        (select max("signedAt")  from "Signing" s where s."agreementId" = a.id) as "lastSignedAt"
       from "Agreement" a
       order by "createdAt" desc`
        );
        res.json(r.rows);
    } else {
        res.status(405).end();
    }
}
