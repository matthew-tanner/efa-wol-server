// CORE MODULES
const express = require("express");
const cors = require("cors");
const debug = require("debug")("http");
const dotEnv = require("dotenv");

dotEnv.config();

// SERVER MODULES
const dbConn = require("./db/index");
const controllers = require("./controllers");

// LOCAL VARIABLES
const appName = "Workout Log API";
const PORT = process.env.PORT;

const app = express();
debug("starting %o", appName);

app.use(express.json());
app.use("/user", controllers.UserController);
app.use("/log", controllers.LogController);

dbConn
  .authenticate()
  .then(() => dbConn.sync())
  .then(() => {
    app.listen(PORT, () => {
      debug("listening on %o", PORT);
    });
  })
  .catch((err) => {
    debug(`${err}`);
  });
