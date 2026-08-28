export default class CurrencyFormatterUtility {
  public static current: CurrencyFormatterUtility = new CurrencyFormatterUtility();

  private constructor() {}

  /**
   * Returns the appropriate currency symbol based on standard ISO code or symbol.
   */
  public getSymbol(currency?: string | null): string {
    const c = currency?.toUpperCase().trim();
    if (!c) return '$';
    if (c === 'INR' || c === '₹' || c === 'RUPEES' || c === 'RUPEE') return '₹';
    if (c === 'USD' || c === '$') return '$';
    if (c === 'EUR' || c === '€') return '€';
    if (c === 'GBP' || c === '£') return '£';
    if (c === 'JPY' || c === '¥') return '¥';
    if (c === 'CAD' || c === 'AUD') return `${c} $`;
    return `${c} `;
  }

  /**
   * Formats numeric currency amounts with dynamic currency symbol.
   */
  public format(amount?: number | null, currency?: string | null): string {
    const val = Number(amount ?? 0);
    const symbol = this.getSymbol(currency);
    return `${symbol}${val.toLocaleString()}`;
  }

  /**
   * Determines the dominant currency from an array of assets/currencies.
   */
  public getDominantCurrency(currencies: (string | undefined | null)[]): string {
    const valid = currencies.filter(Boolean).map((c) => c!.toUpperCase().trim());
    if (valid.length === 0) return 'USD';
    const first = valid[0];
    const allSame = valid.every((c) => c === first);
    return allSame ? first : 'USD';
  }
}
