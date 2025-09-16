export function renderAgreement({ bodyTemplate, artistName, artistEmail, date, tracks, company='Your Company', signatureBlock }) {
  const safe = (s) => String(s ?? '').replace(/[&<>"]/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]))
  const tracksHtml = Array.isArray(tracks) && tracks.length
    ? `<ol>${tracks.map(t=>`<li>${safe(t)}</li>`).join('')}</ol>` : '<ol></ol>'
  return bodyTemplate
    .replaceAll('{{ARTIST_NAME}}', safe(artistName))
    .replaceAll('{{ARTIST_EMAIL}}', safe(artistEmail))
    .replaceAll('{{DATE}}', safe(date))
    .replaceAll('{{TRACKS}}', tracksHtml)
    .replaceAll('{{COMPANY_NAME}}', safe(company))
    .replaceAll('{{E_SIGNATURE_BLOCK}}', signatureBlock)
}
