import fs from "node:fs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import jsdom, { JSDOM } from "jsdom";
import {
  City,
  CityCode,
  WeatherData,
  RealtimeData,
  capital,
  dateType,
} from "./types.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("PRC");

export async function getCities(): Promise<City> {
  const url = "https://j.i8tq.com/weather2020/search/city.js";

  const response = await fetch(url);

  const city_data_resp: string = await response.text();

  const city_data_json: string = city_data_resp.replace("var city_data = ", "");

  const city_data: City = JSON.parse(city_data_json);

  return city_data;
}

export async function getWeatherData(code: string): Promise<WeatherData> {
  const url = `http://www.weather.com.cn/weather1d/${code}.shtml#search`;

  const response = await fetch(url);

  const dom_string: string = await response.text();

  const dom = new JSDOM(dom_string).window.document;

  if (dom == null) throw new Error("Failed to parse HTML");

  const nodeList = dom.querySelectorAll("#today > div.t > ul > li");
  if (nodeList.length !== 2) throw new Error("Failed to find today's weather");
  const [day, night] = nodeList as unknown as [Element, Element];

  const dayDate = day.querySelector("h1")?.textContent;
  const dayWeather = day.querySelector("p.wea")?.textContent;
  const daySky = day.querySelector("p.sky > span")?.textContent;
  const dayTemp = day.querySelector("p.tem > span")?.textContent;
  const dayTempUnit = day.querySelector("p.tem > em")?.textContent;
  const dayWindDirection = day
    .querySelector("p.win > span")
    ?.getAttribute("title");
  const dayWindDirectionCode = day
    .querySelector("p.win > i")
    ?.getAttribute("class");
  const dayWindLevel = day.querySelector("p.win > span")?.textContent;
  const daySunrise = day.querySelector("p.sun > span")?.textContent;

  const nightDate = night.querySelector("h1")?.textContent;
  const nightWeather = night.querySelector("p.wea")?.textContent;
  const nightTemp = night.querySelector("p.tem > span")?.textContent;
  const nightTempUnit = night.querySelector("p.tem > em")?.textContent;
  const nightWindDirection = night
    .querySelector("p.win > span")
    ?.getAttribute("title");
  const nightWindDirectionCode = night
    .querySelector("p.win > i")
    ?.getAttribute("class");
  const nightWindLevel = night.querySelector("p.win > span")?.textContent;
  const nightSunset = night.querySelector("p.sun > span")?.textContent;

  return {
    day: {
      date: dayDate,
      weather: dayWeather,
      sky: daySky,
      temp: dayTemp,
      tempUnit: dayTempUnit,
      wind: {
        direction: dayWindDirection ?? undefined,
        directionCode: dayWindDirectionCode ?? undefined,
        level: dayWindLevel,
      },
      sunrise: daySunrise,
    },
    night: {
      date: nightDate,
      weather: nightWeather,
      temp: nightTemp,
      tempUnit: nightTempUnit,
      wind: {
        direction: nightWindDirection ?? undefined,
        directionCode: nightWindDirectionCode ?? undefined,
        level: nightWindLevel,
      },
      sunset: nightSunset,
    },
  };
}

export async function getRealtimeData(code: string): Promise<RealtimeData> {
  const result = JSON.parse(
    await (
      await (
        await fetch(`http://d1.weather.com.cn/sk_2d/${code}.html`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
            Referer: "http://www.weather.com.cn/",
          },
        })
      ).text()
    ).replace("var dataSK=", "")
  );

  return result;
}

export async function getDate(today: Date): Promise<dateType> {
  const date = dayjs.tz(today).format("YYYY-MM-DD");
  const datetime = dayjs.tz(today).format("YYYY-MM-DD HH:mm:ss");

  return { date, datetime };
}

export function formatDate(today: Date): string {
  const format_date: string = dayjs.tz(today).format("YYYY-MM-DD_HH_mm_ss");

  return format_date;
}

export function flattenObject(obj: City): CityCode {
  const flat_obj: CityCode = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flat_obj, flattenObject(obj[key] as City));
      } else {
        const city = obj["NAMECN"] as string;
        const code = obj["AREAID"] as string;
        flat_obj[city] = code;
      }
    }
  }

  return flat_obj;
}

export function getCapitals(obj: City): capital[] {
  const capitals: capital[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        const arr = getCapitals(obj[key] as City);
        if (!arr.length) {
          capitals.push({
            province: key as string,
            city: Object.keys(obj[key])[0] as string,
          });
        }
      } else {
        return [];
      }
    }
  }

  return capitals;
}

export function mkdir(folder: string) {
  fs.mkdir(`${folder}`, { recursive: true }, (err: any) => {
    if (err) throw err;
  });
}

export function writeFile(name: string, data: string | object) {
  if (typeof data !== "string") data = JSON.stringify(data, null, 2);

  fs.writeFile(`./${name}`, data, (err: any) => {
    if (err) throw err;
    console.log(`${name} has been created successfully.`);
  });
}
