require("colors");
const inquirer = require("inquirer");

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "place",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Please enter a value";
        }
        return true;
      },
    },
  ];
  const { place } = await inquirer.prompt(question);

  return place;
};

const listItems = async (items, message) => {
  const choices = items.map((items, index) => {
    return {
      value: items.id,
      name: `${index + 1}. ${items.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0. Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message,
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

const printData = (data, weather) => {
  console.log(`\n City info\n`.green);
  console.log(`City: ${data.name}`);
  console.log(`lat: ${data.lat}`);
  console.log(`lng: ${data.lng}`);
  console.log(`weather: ${weather.desc}`);
  console.log(`temp: ${weather.temp} ${"°C".green}`);
  console.log(`temp_min: ${weather.temp_min} ${"°C".green}`);
  console.log(`temp_max: ${weather.temp_max} ${"°C".green}`);
  console.log(`humidity: ${weather.humidity} %`);
};

module.exports = { readInput, listItems, printData };
