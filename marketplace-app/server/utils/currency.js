const SYMBOLS = {
  USD: '$',
  INR: '₹',
};

export const formatPrice = (amount, currency = 'USD') => {
  const symbol = SYMBOLS[currency] || '$';
  return `${symbol}${amount}`;
};

export const currencySymbol = (currency = 'USD') => SYMBOLS[currency] || '$';