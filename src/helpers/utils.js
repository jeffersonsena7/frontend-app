export function normalizeText(text) {
  if (text == null) return '';
  return text.toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function converterParaObjetos(rows, headers) {
  return rows.map(row => {
    const obj = {};
    const length = Math.max(headers.length, row.length);
    for (let i = 0; i < length; i++) {
      const chave = headers[i] && headers[i].trim() !== '' ? headers[i] : `Coluna ${i + 1}`;
      obj[chave] = row[i] ?? '';
    }
    return obj;
  });
}
