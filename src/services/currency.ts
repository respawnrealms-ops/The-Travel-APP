export interface ExchangeRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // rate against USD
}

export const SUPPORTED_CURRENCIES: ExchangeRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 156.4 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.37 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.9 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
];

export const currencyService = {
  getRates: (): ExchangeRate[] => {
    return SUPPORTED_CURRENCIES;
  },

  convert: (amount: number, from: string, to: string): number => {
    const fromCurr = SUPPORTED_CURRENCIES.find(c => c.code === from);
    const toCurr = SUPPORTED_CURRENCIES.find(c => c.code === to);
    if (!fromCurr || !toCurr) return amount;
    // convert from -> USD -> to
    const amountInUSD = amount / fromCurr.rate;
    return amountInUSD * toCurr.rate;
  },

  getHistory: (from: string, to: string): { date: string; rate: number }[] => {
    // Generate simulated 30-day history with tiny random walk variations
    const history = [];
    const baseRate = currencyService.convert(1, from, to);
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      // Small variation between -2% and +2%
      const dayVariance = 1 + (Math.sin(i / 3) * 0.015) + (Math.cos(i / 5) * 0.005);
      history.push({
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        rate: Number((baseRate * dayVariance).toFixed(4)),
      });
    }
    return history;
  }
};
