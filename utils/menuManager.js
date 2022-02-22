require("colors");
const { menuOptions } = require("../libs/questions.json");
//const { saveData } = require("./dbInteraction");
const inquirer = require("inquirer");
const { readInput, listItems, printData } = require("./menuFunctions");
const Searches = require("../models/Searches");

const menu = async () => {
  console.clear();
  console.log("\n====================".blue);
  console.log("Weather App".bgBlue.black);
  console.log("====================\n".blue);
  const { opt } = await inquirer.prompt(menuOptions);
  return opt;
};

const pause = async () => {
  console.log("\n");
  await inquirer.prompt([
    {
      type: "input",
      name: "enter",
      message: "Press ENTER to continue",
    },
  ]);
};

const menuNavigation = async () => {
  let opt = "";
  const searches = new Searches();
  do {
    opt = await menu();

    switch (opt) {
      case "1":
        const searchText = await readInput("Enter the name of the city: ".blue);
        const places = await searches.city(searchText);
        const selectedId = await listItems(places, "Select one place");
        if (selectedId == "0") continue;
        const place = places.find((item) => item.id === selectedId);
        const weather = await searches.weather(place);
        printData(place, weather);
        searches.addToHistory(place.name);
        break;

      case "2":
        searches.history.forEach((item, index) => {
          console.log(`${index + 1}. ${item}`.black.bgGreen);
        });
        break;
    }

    if (opt !== "0") await pause();
  } while (opt !== "0");
};

module.exports = { menuNavigation };
