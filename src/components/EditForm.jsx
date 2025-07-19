import React, { useState, useEffect } from 'react';

export default function EditForm({
  item,
  editData,
  setEditData,
  salvarEdicao,
  cancelarEdicao,
  foto,
  setFoto,
  previewFoto,
  setPreviewFoto
}) {
  const [uploading, setUploading] = useState(false);

  // Sincroniza previewFoto com editData.fotoURL
  useEffect(() => {
    if (editData.fotoURL) {
      setPreviewFoto(editData.fotoURL);
    } else {
      setPreviewFoto(null);
    }
  }, [editData.fotoURL]);

  const handleUploadFoto = async (file) => {
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'picturestag');
    data.append('folder', 'equipamentos');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/do6fz60dx/image/upload', {
        method: 'POST',
        body: data,
      });

      const fileData = await res.json();

      if (fileData.secure_url) {
        console.log('👉 URL Cloudinary:', fileData.secure_url);

        setPreviewFoto(fileData.secure_url);
        setEditData(prev => ({
          ...prev,
          fotoURL: fileData.secure_url,
          publicId: fileData.public_id // salva publicId
        }));

        console.log('👉 editData no EditForm:', {
          ...editData,
          fotoURL: fileData.secure_url,
          publicId: fileData.public_id
        });
      } else {
        alert('Erro no upload da foto');
      }
    } catch (err) {
      alert('Erro no upload da foto');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);
    handleUploadFoto(file);
  };

  // Função para obter o valor da tag (chave pode variar)
  const obterTag = () => {
    const possiveisTags = ['tag', 'TAG', 'Tag'];
    for (const chave of possiveisTags) {
      if (editData[chave]) return editData[chave];
    }
    return null;
  };

  return (
    <>
      <input
        type="text"
        value={editData['Descricao'] || editData['descricao'] || ''}
        onChange={e => setEditData(prev => ({ ...prev, Descrição: e.target.value }))}
        placeholder="Descrição"
        className="input-edit"
      />

      {Object.entries(item).map(([chave]) => {
        if (['Descricao', 'descricao'].includes(chave)) return null;

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

      <div style={{ marginTop: 10 }}>
        <label htmlFor="foto">📷 Tirar ou selecionar foto:</label>
        <input
          type="file"
          id="foto"
          accept="image/*"
          capture="environment"
          onChange={handleChangeFile}
        />
        {uploading && <p>Enviando foto...</p>}
      </div>

      {/* IMAGEM DE PRÉ-VISUALIZAÇÃO */}
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

          {/* Botão para remover da nuvem e planilha */}
          {editData.publicId && (
            <button
              onClick={async () => {
                const confirmar = window.confirm('Remover a imagem da nuvem e da planilha?');
                if (!confirmar) return;

                const tag = obterTag();
                if (!tag) {
                  alert('Tag não encontrada para remover a foto.');
                  return;
                }

                try {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/planilha/foto/${tag}`, {
                    method: 'DELETE',
                  });

                  const data = await res.json();

                  if (data.success) {
                    alert('Imagem removida com sucesso da nuvem e planilha!');
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

      <div className="card-footer">
        <button className="detalhes-btn" onClick={salvarEdicao}>Salvar</button>
        <button onClick={cancelarEdicao} style={{ backgroundColor: '#888', marginLeft: 10 }}>Cancelar</button>
      </div>
    </>
  );
}
