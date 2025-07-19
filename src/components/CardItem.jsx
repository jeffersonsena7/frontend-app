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

  const [isFullscreen, setIsFullscreen] = useState(false);

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

        
      </div>
    );
  }

  return (
  <div className="card">
    <h2 className="card-title">⚙️ {item['Descrição'] || item['descrição'] || 'Item'}</h2>

    {Object.entries(item).map(([chave, valor], i) => {

      const chaveNormalizada = normalizeText(chave);

      if (['Descrição', 'descrição', 'fotourl', 'publicId'].includes(chaveNormalizada)) 
        return null;

      const isDestaque = ['Tag', 'Potência', 'Código', 'Corrente', 'Tensão'].some(k =>
        normalizeText(k) === normalizeText(chave)
      );
        console.log('Chaves do item:', Object.keys(item));
      return (
        <div className={`card-item ${isDestaque ? 'destaque' : ''}`} key={i}>
          <strong>{chave}:</strong> {valor}
        </div>
      );
    })}

    {isImageValid && (
  <div className="card-imagem-wrapper">
    <img
      src={imageUrl}
      alt={`Foto do equipamento ${item['Descrição'] || item['descrição'] || ''}`}
      onError={handleImageError}
      className={`card-imagem ${isFullscreen ? 'fullscreen' : ''}`}
      onClick={() => setIsFullscreen(prev => !prev)}
    />
    <button
      className="btn-expandir"
      onClick={(e) => {
        e.stopPropagation();
        setIsFullscreen(prev => !prev);
      }}
      title={isFullscreen ? 'Voltar' : 'Expandir'}
    >
      {isFullscreen ? '🔙' : '🔍'}
    </button>
  </div>
)}

    <div className="card-footer">
      <button className="detalhes-btn" onClick={() => iniciarEdicao(index)}>Editar</button>
    </div>
  </div>
);

}
