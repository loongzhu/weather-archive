import { getCitys, formatDate, flattenObject, writeFile } from "./api.ts";
import { CityCode } from "./types.ts";

const city_data = await getCitys();

// console.log("🚀 ~ city_data:", city_data);

// const date = formatDate();

// console.log("🚀 ~ date:", date + ".json");

const city_codes = flattenObject(city_data);

const city_arr = ["北京", "上海", "天津", "重庆", "沧州"];

const citys: CityCode = Object.keys(city_codes).reduce(
  (obj: CityCode, key: string) => {
    if (city_arr.includes(key)) {
      obj[key] = city_codes[key];
    }
    return obj;
  },
  {}
);

console.log("🚀 ~ citys:", citys);

writeFile("flattened.json", city_codes);
