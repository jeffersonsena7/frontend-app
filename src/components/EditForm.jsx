import React from 'react';

export default function EditForm({ item, editData, setEditData, salvarEdicao, cancelarEdicao, foto, setFoto, previewFoto, setPreviewFoto }) {

  const handleUploadFoto = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ml_default');  // <<< TROQUE AQUI
    // Exemplo: 'ml_default'

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/do6fz60dx/image/upload', {  // <<< TROQUE AQUI
        method: 'POST',
        body: data,
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setPreviewFoto(fileData.secure_url);  // mostra URL do Cloudinary
        setEditData(prev => ({ ...prev, fotoUrl: fileData.secure_url }));  // salva URL na edição
      } else {
        alert('Erro no upload da foto');
      }
    } catch (err) {
      alert('Erro no upload da foto');
      console.error(err);
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);
    // Ao invés de ler local, já faz upload pra Cloudinary
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
        {previewFoto && (
          <div style={{ marginTop: 10 }}>
            <p><strong>Pré-visualização:</strong></p>
            <img
              src={previewFoto}
              alt="Prévia da Foto"
              className='foto-preview'
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
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
