import axios from 'axios';

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface WeatherForecast {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export async function getWeatherForecast(
  lat: number,
  lon: number
): Promise<WeatherForecast> {
  try {
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not found in environment variables');
    }

    const response = await axios.get<WeatherResponse>(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric', // Use metric for Celsius
          lang: 'th', // Thai language for descriptions
        },
      }
    );

    return {
      temp: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather forecast');
  }
}
