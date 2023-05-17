export interface City {
  [key: string]: string | City;
}

export interface CityCode {
  [city: string]: string;
}
