const fs = require("fs");
const axios = require("axios");
const capitalize = require("../utils/capitalizeFunction");
require("dotenv").config();

class Searches {
  history = [];
  dbPath = "./db/data.json";

  constructor() {
    this.history = this.readData();
  }

  get mapBoxParams() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "en",
    };
  }
  openWeathersParams(place) {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lat: place.lat,
      lon: place.lng,
      units: "metric",
    };
  }

  async city(searchText = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json`,
        params: this.mapBoxParams,
      });
      const response = await instance.get();
      return response.data.features.map((item) => ({
        id: item.id,
        name: item.place_name,
        lng: item.center[0],
        lat: item.center[1],
      }));
    } catch (error) {
      console.log("ERROR", error);
      return [];
    }
  }

  async weather(place) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather/`,
        params: this.openWeathersParams(place),
      });
      const response = await instance.get();
      const data = response.data;

      return {
        desc: data.weather[0].description,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
      };
    } catch (error) {
      return {};
    }
  }

  addToHistory(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) return;
    this.history.unshift(place.toLocaleLowerCase());
    this.saveData();
  }

  saveData() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readData() {
    try {
      if (!fs.existsSync(this.dbPath)) {
        return [];
      }
      const response = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
      const data = JSON.parse(response);
      return data.history.map((item) => {
        return capitalize(item);
      });
    } catch (error) {
      return [];
    }
  }
}

module.exports = Searches;
