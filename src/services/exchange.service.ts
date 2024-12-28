import axios from 'axios';

export interface ExchangeRate {
  rate: number;
  timestamp: string;
}

export async function getJPYToTHBRate(): Promise<ExchangeRate> {
  try {
    // Using Exchange Rate API (https://exchangerate-api.com/)
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/JPY/THB`
    );

    return {
      rate: response.data.conversion_rate,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw new Error('Failed to fetch exchange rate');
  }
}
