import React, { useState } from 'react';

export default function EditForm({ item, editData, setEditData, salvarEdicao, cancelarEdicao, foto, setFoto, previewFoto, setPreviewFoto }) {

  const [uploading, setUploading] = useState(false);

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
        setEditData(prev => ({ ...prev, fotoUrl: fileData.secure_url }));
        console.log('👉 editData no EditForm:', novo);
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

  // Função para apagar foto
  const apagarFoto = () => {
    setFoto(null);
    setPreviewFoto(null);
    setEditData(prev => {
      const copy = { ...prev };
      delete copy.fotoUrl;  // remove a propriedade fotoUrl se existir
      return copy;
    });
  };

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
        {previewFoto && (
          <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
            <p><strong>Pré-visualização:</strong></p>
            <img
              src={previewFoto}
              alt="Prévia da Foto"
              className='foto-preview'
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
            {/* Botão pequeno para apagar foto */}
            <button
              onClick={apagarFoto}
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
              title="Apagar foto"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="detalhes-btn" onClick={salvarEdicao}>Salvar</button>
        <button onClick={cancelarEdicao} style={{ backgroundColor: '#888', marginLeft: 10 }}>Cancelar</button>
      </div>
    </>
  );
}
