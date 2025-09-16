import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);

    const load = async () => {
        if (!id) return;
        const res = await fetch(`/api/admin/agreements/${id}`);
        const json = await res.json();
        setData(json);
    };
    useEffect(() => {
        load();
    }, [id]);

    if (!data) return <div className="container py-10">Loading…</div>;
    const { agreement, signings } = data;

    const copyLink = async () => {
        const url = `${window.location.origin}/a/${agreement.slug}`;
        await navigator.clipboard.writeText(url);
        alert("Link copied: " + url);
    };

    const toggle = async () => {
        await fetch(`/api/admin/agreements/${agreement.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !agreement.isActive }),
        });
        load();
    };

    return (
        <div className="container py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    {agreement.title || "(untitled)"}
                </h1>
                <div className="flex gap-2">
                    <button className="btn" onClick={copyLink}>
                        Copy Link
                    </button>
                    <button className="btn" onClick={toggle}>
                        {agreement.isActive ? "Disable" : "Enable"}
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <div>
                            <span className="font-medium">Slug:</span>{" "}
                            <code>{agreement.slug}</code>
                        </div>
                        <div>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(agreement.createdAt).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span>{" "}
                            {agreement.isActive ? "Active" : "Disabled"}
                        </div>
                        <div>
                            <span className="font-medium">Seller Party:</span>{" "}
                            {agreement.sellerParty}
                        </div>
                    </div>
                    <div>
                        <div className="font-medium mb-1">Tracks</div>
                        <ol className="list-decimal ml-6">
                            {" "}
                            {(agreement.tracks || []).map((t, i) => (
                                <li key={i}>{t.title}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
            <div className="card">
                <h2 className="font-semibold mb-2">Signed</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Signed At</th>
                            <th className="th">Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {signings.map((s) => (
                            <tr key={s.id}>
                                <td className="td">{s.artistName}</td>
                                <td className="td">{s.artistEmail}</td>
                                <td className="td">
                                    {new Date(s.signedAt).toLocaleString()}
                                </td>
                                <td className="td">
                                    <code className="text-xs">
                                        {s.pdfSha256.slice(0, 12)}…
                                    </code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
