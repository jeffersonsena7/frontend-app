import React, { useState, useEffect } from 'react';
import './App.css';
import { getPlanilha } from './services/api';
import { normalizeText, converterParaObjetos } from './helpers/utils';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';


function App() {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);

  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  
  useEffect(() => {
    getPlanilha()
      .then(({ headers, rows }) => {
        setHeaders(headers);
        setRows(rows);
      })
      .catch(() => alert('Erro ao carregar a planilha'));
  }, []);

  const buscar = () => {
    if (!termoBusca.trim()) return alert('Digite uma palavra para buscar');
    const termo = normalizeText(termoBusca);

    const colunasAlvo = ['descricao', 'descrição', 'denominacao', 'denominação', 'tag'];
    const colunasRelevantes = headers
      .map((header, index) => ({
        nome: normalizeText(header),
        index
      }))
      .filter(h => colunasAlvo.some(padrao => h.nome.includes(padrao)));

    if (colunasRelevantes.length === 0) {
      return alert('Nenhuma coluna "Descrição", "Tag" ou "Denominação" encontrada.');
    }

    const encontrados = rows.filter(row =>
      colunasRelevantes.some(({ index }) => {
        const valor = row[index];
        return normalizeText(valor).includes(termo);
      })
    );

    setResultados(encontrados);
  };

  const salvarEdicao = async () => {
  try {
    let fotoUrl = null;

    if (foto) {
      const formData = new FormData();
      formData.append('file', foto);
      formData.append('upload_preset', 'ml_default'); // substitua pelo seu
      const res = await fetch('https://api.cloudinary.com/v1_1/do6fz60dx/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      fotoUrl = data.secure_url;

      editData.fotoUrl = fotoUrl; // adiciona ao objeto
    }

    const novaLinha = headers.map(h => editData[h] ?? '');
    const novosResultados = [...resultados];
    novosResultados[editIndex] = novaLinha;

    const indiceTag = headers.findIndex(h => ['tag', 'TAG', 'Tag'].includes(h));
    const tagEditada = editData[headers[indiceTag]];

    const novaRows = rows.map(row =>
      row[indiceTag] === tagEditada ? novaLinha : row
    );

    setResultados(novosResultados);
    setRows(novaRows);
    setEditIndex(null);
    setEditData({});
    setFoto(null);
    setPreviewFoto(null);
  } catch (error) {
    alert('Erro ao salvar a edição com foto.');
    console.error(error);
  }
};

  const cancelarEdicao = () => {
    setEditIndex(null);
    setEditData({});
  };

  const iniciarEdicao = (index) => {
  const item = converterParaObjetos(resultados, headers)[index];
  setEditIndex(index);
  setEditData(item);
};


  return (
    <div style={{ padding: 20 }}>      
      <h1>🔍 Busca por Descrição e TAG</h1>
      <a href="https://www.linkedin.com/in/jefferson-sena-0b347a232/" target="_blank" rel="noopener noreferrer">
        <p className="assinatura">🌟Jefferson Sena</p>
      </a>
      
      <SearchBar
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        onBuscar={buscar}
        onLimpar={() => setResultados([])}
        headers={headers}
        rows={rows}
      />
      <CardList
        resultados={resultados}
        headers={headers}
        editIndex={editIndex}
        editData={editData}
        setEditData={setEditData}
        setEditIndex={setEditIndex}
        salvarEdicao={salvarEdicao}
        cancelarEdicao={cancelarEdicao}
        iniciarEdicao={iniciarEdicao}
        foto={foto}
        setFoto={setFoto}
        previewFoto={previewFoto}
        setPreviewFoto={setPreviewFoto}
    />

      
    </div>
  );
}

export default App;
