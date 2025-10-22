export const formatCurrency = (amount: number | string, simbolo: string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${simbolo} ${value.toFixed(2)}`;
};
