import { ethers } from "ethers";

export const DAYS_1 = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 + 1);
export const DAYS_3 = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

export function calcPercentage(part: number | bigint, total: number | bigint, precision = 2) {
  return parseFloat(((Number(part) / Number(total)) * 100).toFixed(precision));
}

export function formatMoney(number: number | bigint, symbol?: string) {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);

  return symbol ? `${symbol} ${formattedNumber}` : formattedNumber;
}

export function formatToken(number: number | bigint, decimals: number = 18, symbol?: string) {
  const formater = tokenValueFormatter(decimals);
  const formattedNumber = formater(number);
  return symbol ? `${symbol} ${formattedNumber}` : formattedNumber;
}

export function tokenValueFormatter(decimals: number) {
  return function (weiValue: ethers.BigNumberish, precision = 2) {
    const value = ethers.utils.formatUnits(weiValue, decimals);
    const fixedValue = parseFloat(value).toFixed(precision);
    return fixedValue.toString();
  };
}
