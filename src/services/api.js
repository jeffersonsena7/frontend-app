import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function getPlanilha() {
  const res = await axios.get(`${API_URL}/api/planilha`);
  return res.data;
}
