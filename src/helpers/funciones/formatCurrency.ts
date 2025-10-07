export const formatCurrency = (amount: string, simbolo: string = "L") => {
  return `${simbolo} ${parseFloat(amount).toFixed(2)}`;
};
