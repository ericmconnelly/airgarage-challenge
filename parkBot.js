const fs = require("fs");

const args = process.argv.slice(2);
const command = args[1];
const filename = args[0];

const COMMANDS = {
  locate: locate,
  find_price_hourly_lte: find_price_hourly_lte,
  find_price_hourly_min_max: find_price_hourly_min_max,
};

function locate (garageData, query) {
  const locations = garageData.filter(
    (garage) => garage && garage.address && garage.address.state === query
  );
  return locations.map((garage) => garage.name).join(", ");
};

function find_price_hourly_lte (garageData, price) {
  const locations = garageData.filter(
    (garage) => garage && garage.price_hourly && garage.price_hourly <= price
  );
  return locations.map((garage) => garage.name).join(", ");
};

function find_price_hourly_min_max (garageData, minPrice, maxPrice) {
    console.log(minPrice, maxPrice)
    const locations = garageData.filter(
      (garage) => garage && garage.price_hourly && garage.price_hourly >= minPrice && garage.price_hourly <= maxPrice
    );
    return locations.map((garage) => garage.name).join(", ");
  };

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  let parsedData;
  if (data) {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.log("failed to parse json ", e);
    }

    const commandFn = COMMANDS[command];
    const result = commandFn(parsedData, ...args.slice(2));
  }
});
