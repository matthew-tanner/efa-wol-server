// CORE MODULES
const express = require("express");
const chalk = require("chalk");
const dotEnv = require("dotenv");

const log = console.log;
dotEnv.config();

// SERVER MODULES
const dbConn = require("./db/index");
const controllers = require("./controllers");

// LOCAL VARIABLES
const appName = "Workout Log API";
const PORT = process.env.PORT;

const app = express();
log(`starting ${chalk.blue(appName)}`)

app.use(express.json());
app.use("/user", controllers.UserController);
app.use("/log", controllers.LogController);

dbConn
  .authenticate()
  .then(() => dbConn.sync())
  .then(() => {
    app.listen(PORT, () => {
      log(`listening on port ${chalk.blue(PORT)} `)
    });
  })
  .catch((err) => {
    log(`${err}`);
  });
