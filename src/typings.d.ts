type UserData = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  image: string;
  stats?: {
    paymentCount?: number;
    successfulPayment?: number;
    paymentValue?: number;
  };
};

type Currency = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: string;
};

type PaymentData = {
  payment_id?: string;
  apiKey?: string;
  amount?: number;
  currency?: string;
  status?: string;
  s_callback?: string;
  f_callback?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  name?: string;
  address?: string;
  merchantName?: string;
};

type FiatCurrencyData =
  | {
      [locale: string]: {
        [code: string]: {
          name: string;
          symbol_native: string;
          symbol: string;
          code: string;
          name_plural: string;
          rounding: number;
          decimal_digits: number;
        };
      };
    }
  | {
      [code: string]: {
        name: string;
        symbol_native: string;
        symbol: string;
        code: string;
        name_plural: string;
        rounding: number;
        decimal_digits: number;
      };
    };
