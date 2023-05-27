export interface City {
  [key: string]: string | City;
}

export interface CityCode {
  [city: string]: string;
}

export type capital = {
  province: string;
  city: string;
};

export type WeatherDataPart = {
  date?: string;
  weather?: string;
  sky?: string; // day
  temp?: string;
  tempUnit?: string;
  wind: {
    direction?: string;
    directionCode?: string;
    level?: string;
  };
  sunrise?: string; // day
  sunset?: string; // night
};

export type WeatherData = {
  day: WeatherDataPart;
  night: WeatherDataPart;
};

export type RealtimeData = {
  nameen: string;
  cityname: string;
  city: string;
  temp: string;
  tempf: string;
  wde: string;
  WS: string;
  wse: string;
  SD: string;
  sd: string;
  qy: string;
  njd: string;
  time: string;
  rain: string;
  rain24h: string;
  aqi: string;
  aqi_pm25: string;
  weather: string;
  weathere: string;
  weathercode: string;
  limitnumber: string;
  date: string;
};

export type CityData = {
  id: string;
  province: string;
  city: string;
  realtime?: RealtimeData;
  weather?: WeatherData;
};

export type dateType = {
  date: string;
  datetime: string;
};
