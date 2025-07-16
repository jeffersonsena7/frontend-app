import React from 'react';
import CardItem from './CardItem';
import { converterParaObjetos } from '../helpers/utils';

export default function CardList({ resultados, headers, foto, setFoto, previewFoto, setPreviewFoto, ...props }) {
  if (resultados.length === 0) return null;

  const objetos = converterParaObjetos(resultados, headers);

  return (
    <div className="cards-container">
      {objetos.map((item, index) => (
        <CardItem
          key={index}
          index={index}
          item={item}
          headers={headers}
          foto={foto}                 
          setFoto={setFoto}           
          previewFoto={previewFoto}   
          setPreviewFoto={setPreviewFoto} 
          {...props}
        />
      ))}
    </div>
  );
}

