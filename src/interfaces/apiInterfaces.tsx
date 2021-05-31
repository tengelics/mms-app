export interface IopenWeatherWeatherItem {
  icon: string;
}

export interface IopenWeatherHourly {
  pop: number;
  dt: number;
  temp: number;
  weather: IopenWeatherWeatherItem[];
}

export interface IopenWeatherDaily {
  dt: number;
  rain: number;
  temp: {
    min: number;
    max: number;
  };
  weather: IopenWeatherWeatherItem[];
}

export interface IopenWeatherResponse {
  timezone: string;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
  };
  hourly: IopenWeatherHourly[];
  daily: IopenWeatherDaily[];
}
