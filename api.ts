import fs from "node:fs";

const url = "https://j.i8tq.com/weather2020/search/city.js";

export async function getCitys() {
  const response = await fetch(url);

  const city_data_resp = await response.text();

  const city_data_json = city_data_resp.replace("var city_data = ", "");

  const city_data = JSON.parse(city_data_json);

  // fs.writeFile("./city_data.json", city_data_json, (err: any) => {
  //   if (err) throw err;
  //   console.log("city_data.json has been created successfully.");
  // });

  return city_data;
}
