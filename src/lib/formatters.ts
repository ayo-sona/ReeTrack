import { Currency } from '../types/common';
import { CURRENCY_SYMBOLS, CURRENCY_RATES } from './constants';

export function formatCurrency(
  amount: number,
  currency: Currency = 'NGN',
  showSymbol: boolean = true
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${symbol}${formatted}` : formatted;
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  const amountInNGN = from === 'NGN' ? amount : amount / CURRENCY_RATES[from];
  return to === 'NGN' ? amountInNGN : amountInNGN * CURRENCY_RATES[to];
}

export function calculateAnnualPrice(monthlyPrice: number, discount: number): number {
  return monthlyPrice * 12 * (1 - discount);
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}