// lib/filenames.js

export function buildReadableFilename({
    agreementTitle,
    artistName,
    signedAt,
    signingId,
}) {
    // Fallbacks
    const title = agreementTitle || "Agreement";
    const artist = artistName || "Unknown";
    const ts = new Date(signedAt || Date.now());

    // Format timestamp as YYYY-MM-DD_HHMM (UTC or local as you prefer)
    const yyyy = ts.getUTCFullYear();
    const mm = String(ts.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(ts.getUTCDate()).padStart(2, "0");

    const dateStr = `${yyyy}-${mm}-${dd}`;

    // Build final filename: e.g.
    // Duetti x Sophie Truax - 2025-08-27_1945 - abcd1234.pdf
    return `${title} x ${artist} - ${dateStr} - ${signingId}.pdf`;
}
