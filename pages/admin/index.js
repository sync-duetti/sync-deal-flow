import { useEffect, useState } from "react";

export default function AdminList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const load = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/agreements");
        const data = await res.json();
        setRows(data || []);
        setLoading(false);
    };
    useEffect(() => {
        load();
    }, []);

    const toggleActive = async (id, current) => {
        await fetch(`/api/admin/agreements/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !current }),
        });
        load();
    };

    const copyLink = async (slug) => {
        const url = `${window.location.origin}/a/${slug}`;
        await navigator.clipboard.writeText(url);
        alert("Link copied: " + url);
    };

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl maax font-semibold leading-none">
                    Agreements
                </h1>
                <a className="btn btn-primary" href="/admin/new">
                    New Agreement
                </a>
            </div>
            <div className=" overflow-x-auto">
                {loading ? (
                    <p>Loading…</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="th">Title</th>
                                <th className="th">Slug</th>
                                <th className="th">Link</th>
                                <th className="th">Signed</th>
                                <th className="th"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr
                                    key={r.id}
                                    className="hover:bg-neutral-100/10"
                                >
                                    <td className="td">
                                        <a
                                            className="link"
                                            href={`/admin/${r.id}`}
                                        >
                                            {r.title || "(untitled)"}
                                        </a>
                                    </td>
                                    <td className="td">
                                        <code className="text-xs">
                                            {r.slug}
                                        </code>
                                    </td>
                                    <td className="td">
                                        <span
                                            className={`text-xs p-1 text-center w-full rounded ${
                                                r.isActive
                                                    ? "bg-blue-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {r.isActive ? "active" : "disabled"}
                                        </span>
                                    </td>
                                    {/* <td className="td">{r.signingCount ?? 0}</td> */}
                                    <td className="td">
                                        {r.lastSignedAt
                                            ? new Date(
                                                  r.lastSignedAt
                                              ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "-"}
                                    </td>
                                    <td className="td">
                                        <div className="flex gap-2 text-xs">
                                            <button
                                                className="btn"
                                                onClick={() => copyLink(r.slug)}
                                            >
                                                Copy Link
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    toggleActive(
                                                        r.id,
                                                        r.isActive
                                                    )
                                                }
                                            >
                                                {r.isActive
                                                    ? "Disable"
                                                    : "Enable"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
