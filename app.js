const { menuNavigation } = require("./utils/menuManager");

const app = async () => {
  await menuNavigation();
};

app();
