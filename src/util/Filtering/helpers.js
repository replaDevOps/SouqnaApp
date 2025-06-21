export const normalize = str => (str || '').replace(/\s+/g, '').toLowerCase();

export const getCurrencySymbol = currency => {
  switch ((currency || 'USD').toUpperCase()) {
    case 'TRY': return '₺';
    case 'USD': return '$';
    case 'SYP': return '£';
    default: return '$';
  }
};
