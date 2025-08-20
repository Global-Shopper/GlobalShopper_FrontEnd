import axios from 'axios';

const bankApi = axios.create({
  baseURL: 'https://api.vietqr.io/v2/banks',
});

const QRApi = axios.create({
  baseURL: 'https://img.vietqr.io/image',
});

export function getBanks() {
  return bankApi.get('');
}

// Build a fully-qualified QR image URL (prefer this for <img src=...>)
export function getQRCodeUrl(bankAccountNumber, accountHolderName, providerName, amount, reason) {
  const params = new URLSearchParams({
    amount: String(amount ?? 0),
    addInfo: reason ?? '',
    accountName: accountHolderName ?? '',
  });
  const base = QRApi?.defaults?.baseURL || 'https://img.vietqr.io/image';
  return `${base}/${providerName}-${bankAccountNumber}-qronly.png?${params.toString()}`;
}