import FullAgreement from "../../components/FullAgreement";
import Track from "../../components/Track";
import { query } from "../../lib/db";
import { renderAgreement } from "../../lib/template";
import { useState } from "react";

export async function getServerSideProps({ params }) {
    const { rows } = await query(`select * from "Agreement" where slug=$1`, [
        params.slug,
    ]);
    const agreement = JSON.parse(JSON.stringify(rows[0]));
    return { props: { agreement } };
}

export default function SignPage({ agreement }) {
    if (!agreement || !agreement.isActive) {
        return (
            <div className="container py-10">
                <div className="card">This link is no longer available.</div>
            </div>
        );
    }

    const [artistName, setArtistName] = useState("");
    const [artistEmail, setArtistEmail] = useState("");
    const [date, setDate] = useState(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    });

    const sampleHtml = renderAgreement({
        bodyTemplate: agreement.bodyTemplate,
        artistName: "Artist Name",
        artistEmail: "artist@email.com",
        date: new Date().toISOString().slice(0, 10),
        tracks: agreement.tracks || [],
        company: "Your Company",
        signatureBlock: "<em>Signature will appear here after submit.</em>",
    });

    return (
        <>
            {/* Header */}
            <div className="flex mt-8 flex-col gap-2 items-center justify-center p-4 nuntio">
                <div className="logo text-xl">
                    <img src="/logo.svg" width={200}></img>
                </div>
                <div className="div spacey-2 text-center">
                    {/* <p>DUETTI, Inc.</p> */}
                    <p className="text-xs">
                        250 Lafayette St, 2nd Fl, New York, New York 10012
                    </p>
                </div>
            </div>
            <div className="container grid md:grid-cols-[2fr_1fr] gap-6 relative pb-8">
                {/* left col */}
                <div className="card mb-[24rem] md:mb-0 space-y-4">
                    {/* <div dangerouslySetInnerHTML={{ __html: sampleHtml }} /> */}
                    <div className="text-xl maax">Agreement</div>
                    {/* Agreement Summary */}
                    This synchronization pre-clearance agreement (the
                    “Agreement”) is made and entered into as of{" "}
                    <strong>{date}</strong> (“Effective Date”), by and between{" "}
                    <strong>{artistName || "Artist Name"}</strong> (“Writer”)
                    and Duetti, Inc. (“Duetti”). Writer and Duetti are
                    hereinafter referred to individually as “Party”, and
                    collectively as the “Parties”.
                    {/* Tracks */}
                    <div className="space-y-2">
                        {(agreement.tracks || []).map((t, i) => (
                            <Track key={i} {...t} />
                        ))}
                    </div>
                    {/* Full agreement placeholder */}
                    <div className="expandable-placeholder">
                        <p
                            className="cursor-pointer hover:underline"
                            onClick={(e) => {
                                const content = e.target.nextElementSibling;
                                content.style.display =
                                    content.style.display === "none"
                                        ? "block"
                                        : "none";
                            }}
                        >
                            Read the full agreement...
                        </p>
                        <div
                            className="hidden-content"
                            style={{ display: "none" }}
                        >
                            <FullAgreement
                                sellerParty={agreement.sellerParty}
                            />
                        </div>
                    </div>
                </div>

                {/* right col */}
                <div
                    className="bg-black/20 backdrop-blur-xl rounded-xl shadow-xl p-4 border border-stone-800 flex bg-black/50 flex-col gap-4 md:sticky md:top-4 bottom-0 fixed w-full md:w-auto"
                    style={{
                        height: "fit-content",
                    }}
                >
                    <form
                        className="flex flex-col gap-2"
                        method="POST"
                        action={`/api/sign/${agreement.slug}`}
                    >
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                name="artistName"
                                className="input"
                                onChange={(e) => setArtistName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input
                                name="artistEmail"
                                type="email"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input
                                name="date"
                                type="date"
                                className="input"
                                defaultValue={new Date()
                                    .toISOString()
                                    .slice(0, 10)}
                                required
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <label className="flex items-start gap-2 text-xs cursor-pointer ">
                            <input
                                type="checkbox"
                                name="consent"
                                className=""
                                required
                            />{" "}
                            I Acknowledge That I Have Read And Understand The
                            Terms of the Agreement
                        </label>
                        <button className="text-white p-2 rounded bg-blue-400 mt-4 hover:bg-blue-500 transition">
                            Sign & Download PDF
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
