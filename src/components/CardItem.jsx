import React, { useEffect, useState } from 'react';
import EditForm from './EditForm';
import { normalizeText } from '../helpers/utils';

export default function CardItem({
  index, item, editIndex, editData, setEditData, setEditIndex, headers,
  salvarEdicao, cancelarEdicao, iniciarEdicao,
  foto, setFoto, previewFoto, setPreviewFoto
}) {
  const [isImageValid, setIsImageValid] = useState(true);
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

  const handleImageError = () => {
    setIsImageValid(false);
  };

  const imageUrl = item.fotoURL || 'caminho/para/imagem-padrao.jpg';

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

        {/* IMAGEM DE PRÉ-VISUALIZAÇÃO AGORA AQUI EMBAIXO */}
        {previewFoto && (
          <div style={{ marginTop: 20, position: 'relative', display: 'inline-block' }}>
            <p><strong>Pré-visualização da foto:</strong></p>
            <img
              src={previewFoto}
              alt="Prévia da Foto"
              className='foto-preview'
              style={{ maxWidth: '150px', borderRadius: 8 }}
            />

            {/* Botão para apagar localmente */}
            <button
              onClick={() => {
                setFoto(null);
                setPreviewFoto(null);
                setEditData(prev => {
                  const copy = { ...prev };
                  delete copy.fotoURL;
                  delete copy.publicId;
                  return copy;
                });
              }}
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#ff4d4d',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: 25,
                height: 25,
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '20px',
                padding: 0,
              }}
              title="Apagar localmente"
            >
              ×
            </button>

            {/* Botão para remover da nuvem */}
            {editData.publicId && (
              <button
                onClick={async () => {
                  const confirmar = window.confirm('Remover a imagem da nuvem e da planilha?');
                  if (!confirmar) return;

                  try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/planilha/remover-foto`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ publicId: editData.publicId })
                    });

                    const data = await res.json();

                    if (data.success) {
                      alert('Imagem removida com sucesso da nuvem!');
                      setFoto(null);
                      setPreviewFoto(null);
                      setEditData(prev => {
                        const copy = { ...prev };
                        delete copy.fotoURL;
                        delete copy.publicId;
                        return copy;
                      });
                    } else {
                      alert('Erro ao remover imagem da nuvem.');
                    }
                  } catch (err) {
                    alert('Erro ao conectar com o servidor.');
                    console.error(err);
                  }
                }}
                style={{
                  marginTop: 10,
                  backgroundColor: '#e53935',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                🗑️ Remover da nuvem e planilha
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">⚙️ {item['Descrição'] || item['descrição'] || 'Item'}</h2>
      <img
        src={isImageValid ? imageUrl : 'caminho/para/imagem-padrao.jpg'}
        alt={`Foto do equipamento ${item['Descrição'] || item['descrição'] || ''}`}
        onError={handleImageError}
        style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 10 }}
      />
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
