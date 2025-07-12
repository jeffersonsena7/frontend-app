import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { converterParaObjetos } from '../helpers/utils';

export default function SearchBar({ termoBusca, setTermoBusca, onBuscar, onLimpar, headers, rows }) {
  const baixarXLSX = () => {
    const dadosParaExcel = converterParaObjetos(rows, headers);
    const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha Atualizada");

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'planilha-atualizada.xlsx');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Descrição ou TAG"
        value={termoBusca}
        onChange={e => setTermoBusca(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onBuscar()}
      />
      <button onClick={onBuscar}>Buscar</button>
      <button onClick={onLimpar}>Limpar</button>
      <button onClick={baixarXLSX}>📥 Baixar XLSX</button>
    </div>
  );
}
