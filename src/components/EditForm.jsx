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

   // Adicione este useEffect para sincronizar previewFoto com editData.fotoURL
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
          publicId: fileData.public_id // ← salvando publicId
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
      </div>

      <div className="card-footer">
        <button className="detalhes-btn" onClick={salvarEdicao}>Salvar</button>
        <button onClick={cancelarEdicao} style={{ backgroundColor: '#888', marginLeft: 10 }}>Cancelar</button>
      </div>

      
    </>
  );
}
