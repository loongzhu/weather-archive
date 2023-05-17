import { getCitys } from "./api.ts";

const city_data = await getCitys();

console.log("🚀 ~ city_data:", city_data);
