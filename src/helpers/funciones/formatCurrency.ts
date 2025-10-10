export const formatCurrency = (amount: string, simbolo: string) => {
  return `${simbolo} ${parseFloat(amount).toFixed(2)}`;
};
