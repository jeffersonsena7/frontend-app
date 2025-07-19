import React, { useState, useEffect } from 'react';
import './App.css';
import { getPlanilha } from './services/api';
import { normalizeText, converterParaObjetos } from './helpers/utils';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';

import axios from 'axios';

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
    setTermoBusca('');
  };

  const salvarEdicao = async () => {
    try {
      const formData = new FormData();

      if (editData.fotoURL) {
        formData.append('fotoUrl', editData.fotoURL);
      }

      Object.keys(editData).forEach(key => {
        if (key !== 'fotoUrl') {
          formData.append(key, editData[key]);
        }
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/planilha/salvar`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        alert('Dados salvos com sucesso!');

        // Normaliza as chaves para garantir o mapeamento correto
        const novaLinha = headers.map(h => {
          if (editData[h] !== undefined) return editData[h];
          const keyNormalized = h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const foundKey = Object.keys(editData).find(k =>
            k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === keyNormalized
          );
          return foundKey ? editData[foundKey] : '';
        });

        const novaRows = [...rows];
        novaRows[editIndex] = novaLinha;

        const novosResultados = [...resultados];
        novosResultados[editIndex] = novaLinha;

        setRows(novaRows);
        setResultados(novosResultados);

        setEditIndex(null);
        setEditData({});
        setFoto(null);
        setPreviewFoto(null);
      } else {
        alert('Erro ao salvar os dados');
      }
    } catch (error) {
      console.error('Erro ao salvar a edição com foto:', error);
      alert('Erro ao salvar a edição com foto.');
    }
  };

  const cancelarEdicao = () => {
    setEditIndex(null);
    setEditData({});
    setFoto(null);
    setPreviewFoto(null);
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
