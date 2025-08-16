export const formatCurrency = (amount, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "VND",
  }).format(amount);
};

export const formatVNDWithoutSymbol = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const getLocaleCurrencyFormat = (currency) => {
  switch (currency) {
    case "VND":
      return "vi-VN";
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    case "CNY":
      return "zh-CN";
    case "JPY":
      return "ja-JP";
    case "KRW":
      return "ko-KR";
    case "GBP":
      return "en-GB";
    default:
      return "vi-VN";
  }
};
