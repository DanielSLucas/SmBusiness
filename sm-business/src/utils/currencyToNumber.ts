export function currencyToNumber(currency: string) {
  return Number(currency.replace(/[^0-9,-]/g, "").replace(",", "."));
}