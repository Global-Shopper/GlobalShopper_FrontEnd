import axios from 'axios';

const bankApi = axios.create({
  baseURL: 'https://api.vietqr.io/v2/banks',
});

export function getBanks() {
  return bankApi.get('');
}