import React, { useEffect } from 'react';
import EditForm from './EditForm';
import { normalizeText } from '../helpers/utils';

export default function CardItem({
  index, item, editIndex, editData, setEditData, setEditIndex, headers, salvarEdicao, cancelarEdicao, iniciarEdicao, foto, setFoto, previewFoto, setPreviewFoto
}) {
  const isEditing = index === editIndex;
  const initialized = React.useRef(false);

  useEffect(() => {
    if (isEditing && !initialized.current) {
      setEditData(item);
      initialized.current = true;
    }
    if (!isEditing) {
      initialized.current = false;
    }
  }, [isEditing, item, setEditData]);

  if (isEditing) {
    return (
      <div className="card">
        <EditForm
          item={item}
          editData={editData}
          setEditData={setEditData}
          salvarEdicao={salvarEdicao}
          cancelarEdicao={cancelarEdicao}
          foto={foto}
          setFoto={setFoto}
          previewFoto={previewFoto}
          setPreviewFoto={setPreviewFoto}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">⚙️ {item['Descrição'] || item['descrição'] || 'Item'}</h2>

      {/* Mostrar a foto, se existir */}
      {item.fotoUrl && (
        <img
          src={item.fotoUrl}
          alt={`Foto do equipamento ${item['Descrição'] || item['descrição'] || ''}`}
          style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 10 }}
        />
      )}

      {Object.entries(item).map(([chave, valor], i) => {
        if (['Descrição', 'descrição', 'fotoUrl'].includes(chave)) return null;

        const isDestaque = ['Tag', 'Potência', 'Código', 'Corrente', 'Tensão'].some(k =>
          normalizeText(k) === normalizeText(chave)
        );

        return (
          <div className={`card-item ${isDestaque ? 'destaque' : ''}`} key={i}>
            <strong>{chave}:</strong> {valor}
          </div>
        );
      })}
      <div className="card-footer">
        <button className="detalhes-btn" onClick={() => iniciarEdicao(index)}>Editar</button>
      </div>
    </div>
  );
}
