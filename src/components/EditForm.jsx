import React from 'react';

export default function EditForm({ item, editData, setEditData, salvarEdicao, cancelarEdicao }) {
  return (
    <>
      <input
        type="text"
        value={editData['Descrição'] || editData['descrição'] || ''}
        onChange={e => setEditData(prev => ({ ...prev, Descrição: e.target.value }))}
        placeholder="Descrição"
        className="input-edit"
      />
      {Object.entries(item).map(([chave, valor]) => {
        if (['Descrição', 'descrição'].includes(chave)) return null;

        return (
          <div key={chave} className="card-item">
            <strong>{chave}: </strong>
            <input
              type="text"
              value={editData[chave] ?? ''}
              onChange={e => setEditData(prev => ({ ...prev, [chave]: e.target.value }))}
              className="input-edit"
            />
          </div>
        );
      })}
      <div className="card-footer">
        <button className="detalhes-btn" onClick={salvarEdicao}>Salvar</button>
        <button onClick={cancelarEdicao} style={{ backgroundColor: '#888', marginLeft: 10 }}>Cancelar</button>
      </div>
    </>
  );
}
