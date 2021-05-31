import {SelectedView} from '../screens/WeatherScreen';

export interface iHourlyForecast {
  time: string;
  temp: string;
  pop: string;
  icon: string;
}

export interface iDailyForecast {
  dayOfWeek: string;
  date: string;
  max: string;
  min: string;
  rain: string;
  icon: string;
}

export interface iWeatherState {
  selectedView: SelectedView;
  city: string;
  currentTemp: string;
  currentFeelsLike: string;
  currentPrecipitation: string;
  hourlyForecast: iHourlyForecast[];
  dailyForecast: iDailyForecast[];
  lastSynced: string;
  metHuAttrDate: number;
  refreshing: boolean;
  loading: boolean;
}
