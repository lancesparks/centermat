// helpers/formatters.ts
export const formatCurrency = (
  amount: number | string | null | undefined,
  currency = "USD"
): string => {
  if (amount === null || amount === undefined || amount === "") return "";

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(numericAmount);
};
