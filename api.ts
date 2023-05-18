import fs from "node:fs";
import { City, CityCode } from "./types.ts";

const url = "https://j.i8tq.com/weather2020/search/city.js";

export async function getCitys(): Promise<City> {
  const response = await fetch(url);

  const city_data_resp: string = await response.text();

  const city_data_json: string = city_data_resp.replace("var city_data = ", "");

  const city_data: City = JSON.parse(city_data_json);

  // fs.writeFile("./city_data.json", city_data_json, (err: any) => {
  //   if (err) throw err;
  //   console.log("city_data.json has been created successfully.");
  // });

  return city_data;
}

export function formatDate(): string {
  const date = new Date();

  const date_str: string = date.toLocaleString();

  const format_date: string = date_str.replace(/[\/\s:]/g, "_");

  return format_date;
}

export function flattenObject(obj: City) {
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

export function writeFile(name: string, data: string | object) {
  if (typeof data !== "string") data = JSON.stringify(data);

  fs.writeFile(`./${name}.json`, data, (err: any) => {
    if (err) throw err;
    console.log(`${name}.json has been created successfully.`);
  });
}
