import { useState } from "react";

const DEFAULT_TEMPLATE = `
<h2>Agreement</h2>
<p>This agreement is between {{COMPANY_NAME}} and {{ARTIST_NAME}} ({{ARTIST_EMAIL}}), effective {{DATE}}.</p>
<h3>Tracks</h3>
{{TRACKS}}
<p>By typing your name and submitting, you agree electronically to the terms.</p>
<div style="margin-top:24px">{{E_SIGNATURE_BLOCK}}</div>
`;

// helper: trim -> null for empty
const toNullable = (v) => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s.length ? s : null;
};

export default function NewAgreement() {
    const [title, setTitle] = useState("");
    const [sellerParty, setSellerParty] = useState("");
    const [body, setBody] = useState(DEFAULT_TEMPLATE);

    // tracks are now objects
    const [tracks, setTracks] = useState([
        { title: "", isrc: "", iswc: "", proMlcId: "", duettiCatalogId: "" },
    ]);

    const addTrack = () =>
        setTracks((t) => [
            ...t,
            {
                title: "",
                isrc: "",
                iswc: "",
                proMlcId: "",
                duettiCatalogId: "",
            },
        ]);

    const updateTrack = (i, key, val) =>
        setTracks((t) =>
            t.map((row, idx) => (idx === i ? { ...row, [key]: val } : row))
        );

    const removeTrack = (i) =>
        setTracks((t) => t.filter((_, idx) => idx !== i));

    const create = async (e) => {
        e.preventDefault();

        // clean + require title
        const cleanedTracks = tracks
            .map((t) => ({
                title: (t.title || "").trim(),
                isrc: toNullable(t.isrc),
                iswc: toNullable(t.iswc),
                proMlcId: toNullable(t.proMlcId),
                duettiCatalogId: toNullable(t.duettiCatalogId),
            }))
            .filter((t) => t.title.length); // keep only rows with a title

        const res = await fetch("/api/admin/agreements", {
            // your handler is pages/api/admin/index.js
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                tracks: cleanedTracks, // now an array of objects
                bodyTemplate: body,
                sellerParty: sellerParty,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            window.location.href = `/admin/${data.id}`;
        } else {
            alert(data.error || "Failed to create");
        }
    };

    return (
        <div className="container py-10">
            <h1 className="text-2xl text-center font-semibold mb-4 maax leading-none">
                New Agreement
            </h1>
            <form onSubmit={create} className="grid md:grid-cols-2 gap-6">
                <div className="card space-y-4">
                    <div>
                        <label className="label">Title</label>
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Duetti x Artist Name *"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Seller Party</label>
                        <input
                            className="input"
                            value={sellerParty}
                            onChange={(e) => setSellerParty(e.target.value)}
                            placeholder="Seller Party/Parties in all MPAs that include the Covered Works *"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Track(s)</label>
                        <div className="space-y-3">
                            {tracks.map((t, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-2 items-start"
                                >
                                    <div className="flex flex-row gap-2 w-full">
                                        <input
                                            className="input md:col-span-2"
                                            placeholder={`Title *`}
                                            value={t.title}
                                            onChange={(e) =>
                                                updateTrack(
                                                    i,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="btn hover:bg-red-500"
                                            onClick={() => removeTrack(i)}
                                        >
                                            −
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <input
                                            className="input"
                                            placeholder="ISRC"
                                            value={t.isrc}
                                            onChange={(e) =>
                                                updateTrack(
                                                    i,
                                                    "isrc",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            className="input"
                                            placeholder="ISWC"
                                            value={t.iswc}
                                            onChange={(e) =>
                                                updateTrack(
                                                    i,
                                                    "iswc",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            className="input flex-1"
                                            placeholder="PRO / MLC ID"
                                            value={t.proMlcId}
                                            onChange={(e) =>
                                                updateTrack(
                                                    i,
                                                    "proMlcId",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <input
                                        className="input md:col-span-5"
                                        placeholder="Duetti Catalog ID (optional)"
                                        value={t.duettiCatalogId}
                                        onChange={(e) =>
                                            updateTrack(
                                                i,
                                                "duettiCatalogId",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <div className="w-full h-[1px] bg-neutral-200"></div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn"
                                onClick={addTrack}
                            >
                                Add Track
                            </button>
                        </div>
                    </div>

                    {/* <div>
                        <label className="label">
                            Body Template (HTML with tokens)
                        </label>
                        <textarea
                            className="input"
                            rows={16}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div> */}

                    <button className="btn btn-primary">Create</button>
                </div>

                {/* <div className="card">
                    <h2 className="font-semibold mb-2">Preview</h2>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                </div> */}
            </form>
        </div>
    );
}
