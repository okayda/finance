import { Currencies } from "./currencies";

export function DateToUTCDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
