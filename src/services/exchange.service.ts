import axios from 'axios';
import { appConfig } from '../config/app.config';

export interface ExchangeRate {
  rate: number;
  timestamp: string;
}

export async function getJPYToTHBRate(): Promise<ExchangeRate> {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${appConfig.exchangeRateApiKey}/pair/JPY/THB`;

    const response = await axios.get(url);

    return {
      rate: response.data.conversion_rate,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}
