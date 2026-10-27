// Download locale, condiviso dalle viste senza che esse si conoscano tra loro.
export function scaricaFile(doc, filename, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = doc.createElement('a'); a.href = url; a.download = filename;
  doc.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
