export interface WeatherCondition {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  aqi: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  day: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  condition: string;
}

const mockWeatherData: Record<string, { current: WeatherCondition; hourly: HourlyForecast[]; daily: DailyForecast[] }> = {
  paris: {
    current: {
      temp: 22,
      condition: 'Partly Cloudy',
      icon: 'partly-sunny',
      humidity: 58,
      windSpeed: 12,
      uvIndex: 4,
      aqi: 42,
      sunrise: '05:48 AM',
      sunset: '09:52 PM',
    },
    hourly: [
      { time: 'Now', temp: 22, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { time: '12 PM', temp: 23, icon: 'sunny', condition: 'Sunny' },
      { time: '2 PM', temp: 25, icon: 'sunny', condition: 'Sunny' },
      { time: '4 PM', temp: 24, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { time: '6 PM', temp: 22, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { time: '8 PM', temp: 20, icon: 'cloudy', condition: 'Cloudy' },
      { time: '10 PM', temp: 18, icon: 'cloudy', condition: 'Cloudy' },
    ],
    daily: [
      { day: 'Today', tempMin: 14, tempMax: 25, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { day: 'Tomorrow', tempMin: 15, tempMax: 26, icon: 'sunny', condition: 'Sunny' },
      { day: 'Tuesday', tempMin: 13, tempMax: 22, icon: 'rainy', condition: 'Showers' },
      { day: 'Wednesday', tempMin: 12, tempMax: 20, icon: 'rainy', condition: 'Rain' },
      { day: 'Thursday', tempMin: 14, tempMax: 23, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { day: 'Friday', tempMin: 16, tempMax: 27, icon: 'sunny', condition: 'Sunny' },
      { day: 'Saturday', tempMin: 15, tempMax: 25, icon: 'cloudy', condition: 'Mostly Cloudy' },
    ],
  },
  tokyo: {
    current: {
      temp: 26,
      condition: 'Sunny',
      icon: 'sunny',
      humidity: 72,
      windSpeed: 8,
      uvIndex: 8,
      aqi: 35,
      sunrise: '04:26 AM',
      sunset: '07:01 PM',
    },
    hourly: [
      { time: 'Now', temp: 26, icon: 'sunny', condition: 'Sunny' },
      { time: '12 PM', temp: 28, icon: 'sunny', condition: 'Sunny' },
      { time: '2 PM', temp: 29, icon: 'sunny', condition: 'Sunny' },
      { time: '4 PM', temp: 28, icon: 'sunny', condition: 'Sunny' },
      { time: '6 PM', temp: 25, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { time: '8 PM', temp: 23, icon: 'cloudy', condition: 'Cloudy' },
      { time: '10 PM', temp: 22, icon: 'cloudy', condition: 'Cloudy' },
    ],
    daily: [
      { day: 'Today', tempMin: 19, tempMax: 29, icon: 'sunny', condition: 'Sunny' },
      { day: 'Tomorrow', tempMin: 20, tempMax: 28, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { day: 'Tuesday', tempMin: 21, tempMax: 27, icon: 'rainy', condition: 'Heavy Rain' },
      { day: 'Wednesday', tempMin: 18, tempMax: 24, icon: 'rainy', condition: 'Thunderstorm' },
      { day: 'Thursday', tempMin: 19, tempMax: 26, icon: 'cloudy', condition: 'Cloudy' },
      { day: 'Friday', tempMin: 22, tempMax: 30, icon: 'sunny', condition: 'Sunny' },
      { day: 'Saturday', tempMin: 23, tempMax: 31, icon: 'sunny', condition: 'Sunny' },
    ],
  },
  'new york': {
    current: {
      temp: 18,
      condition: 'Rainy',
      icon: 'rainy',
      humidity: 85,
      windSpeed: 18,
      uvIndex: 2,
      aqi: 18,
      sunrise: '05:24 AM',
      sunset: '08:31 PM',
    },
    hourly: [
      { time: 'Now', temp: 18, icon: 'rainy', condition: 'Rainy' },
      { time: '12 PM', temp: 19, icon: 'rainy', condition: 'Rain' },
      { time: '2 PM', temp: 20, icon: 'rainy', condition: 'Rain' },
      { time: '4 PM', temp: 19, icon: 'cloudy', condition: 'Cloudy' },
      { time: '6 PM', temp: 18, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { time: '8 PM', temp: 17, icon: 'sunny', condition: 'Clear' },
      { time: '10 PM', temp: 15, icon: 'sunny', condition: 'Clear' },
    ],
    daily: [
      { day: 'Today', tempMin: 14, tempMax: 20, icon: 'rainy', condition: 'Rainy' },
      { day: 'Tomorrow', tempMin: 13, tempMax: 22, icon: 'partly-sunny', condition: 'Partly Cloudy' },
      { day: 'Tuesday', tempMin: 12, tempMax: 24, icon: 'sunny', condition: 'Sunny' },
      { day: 'Wednesday', tempMin: 15, tempMax: 26, icon: 'sunny', condition: 'Sunny' },
      { day: 'Thursday', tempMin: 16, tempMax: 25, icon: 'cloudy', condition: 'Mostly Cloudy' },
      { day: 'Friday', tempMin: 14, tempMax: 23, icon: 'rainy', condition: 'Light Rain' },
      { day: 'Saturday', tempMin: 13, tempMax: 21, icon: 'sunny', condition: 'Sunny' },
    ],
  },
};

const defaultWeather = {
  current: {
    temp: 20,
    condition: 'Pleasant',
    icon: 'partly-sunny',
    humidity: 60,
    windSpeed: 10,
    uvIndex: 5,
    aqi: 38,
    sunrise: '06:00 AM',
    sunset: '08:00 PM',
  },
  hourly: [
    { time: 'Now', temp: 20, icon: 'partly-sunny', condition: 'Partly Cloudy' },
    { time: '2 hrs', temp: 22, icon: 'sunny', condition: 'Sunny' },
    { time: '4 hrs', temp: 23, icon: 'sunny', condition: 'Sunny' },
    { time: '6 hrs', temp: 21, icon: 'cloudy', condition: 'Cloudy' },
  ],
  daily: [
    { day: 'Today', tempMin: 15, tempMax: 23, icon: 'partly-sunny', condition: 'Partly Cloudy' },
    { day: 'Tomorrow', tempMin: 16, tempMax: 24, icon: 'sunny', condition: 'Sunny' },
    { day: 'Day 3', tempMin: 14, tempMax: 22, icon: 'cloudy', condition: 'Cloudy' },
  ],
};

export const weatherService = {
  getWeather: (city: string) => {
    const key = city.toLowerCase().trim();
    for (const [k, data] of Object.entries(mockWeatherData)) {
      if (key.includes(k) || k.includes(key)) {
        return data;
      }
    }
    return defaultWeather;
  },
};
