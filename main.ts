import {
  getCities,
  getDate,
  formatDate,
  flattenObject,
  writeFile,
  getWeatherData,
  getRealtimeData,
  getCapitals,
  mkdir,
} from "./api.ts";
import { CityCode, CityData, dateType } from "./types.ts";
import process from "process";

const { node: node_version } = process.versions;

if (node_version < "18.0.0") {
  throw new Error("node version must >= 18.0.0");
}

async function main() {
  try {
    const city_data = await getCities();

    const city_codes = flattenObject(city_data);

    const capitals = getCapitals(city_data);

    const cities: CityData[] = capitals.map((capital) => {
      const city = {
        id: city_codes[capital.city],
        province: capital.province,
        city: capital.city,
      };
      return city;
    });

    for (let city of cities) {
      city.realtime = await getRealtimeData(city.id);
      city.weather = await getWeatherData(city.id);
    }

    const today = new Date();
    const { date, datetime }: dateType = await getDate(today);
    const fDate = formatDate(today);

    const content = {
      timestamp: today.getTime(),
      lastUpdate: datetime,
      data: cities,
    };

    await mkdir(`weathers/${date}`);

    await writeFile(`weathers/${date}/${fDate}.json`, content);

    await writeFile(`weathers/${date}/latest.json`, content);

    await writeFile(`weathers/latest.json`, content);
  } catch (err: any) {
    main();
  }
}

main();
