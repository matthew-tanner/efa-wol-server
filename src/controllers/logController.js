const router = require("express").Router();
const chalk = require("chalk");

const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

const log = console.log;

router.post("/", validateJWT, async (req, res) => {
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    req.body
  );
  const { id } = req.user;
  const { description, definition, result } = req.body.log;

  try {
    if ((description, definition, result)) {
      const newLog = await LogModel.create({
        description,
        definition,
        result,
        owner_id: id,
      });
      res.status(200).json({
        response: "Success",
        data: newLog,
      });
      log(`log created - ${JSON.stringify(newLog, null, 2)}`);
    } else {
      log(chalk`{bgRed error} 400 - bad request`);
      return res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "Error",
    });
  }
});

router.get("/", validateJWT, async (req, res) => {
  const { id } = req.user;
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    id
  );

  try {
    const userLogs = await LogModel.findAll({
      where: {
        owner_id: id,
      },
    });
    res.status(200).json({
      response: "Success",
      data: userLogs,
    });
    log(`response (200) : ${JSON.stringify(userLogs)}`);
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "Error",
    });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    id,
    logId
  );

  try {
    const userLog = await LogModel.findOne({
      where: {
        id: logId,
        owner_id: id,
      },
    });

    if (userLog) {
      res.status(200).json({
        response: "Success",
        data: userLog,
      });
      log(`response (200) : ${JSON.stringify(userLog)}`);
    } else {
      log(chalk`{bgRed error} 400 - bad request`);
      return res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "Error",
    });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;
  const { description, definition, result } = req.body.log;
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    id,
    logId,
    JSON.stringify(req.body)
  );

  const updateQuery = {
    where: {
      id: logId,
      owner_id: id,
    },
    returning: true,
  };
  const updateEntry = {
    description,
    definition,
    result,
    owner_id: id,
  };

  try {
    const updateLog = await LogModel.update(updateEntry, updateQuery);

    if (updateLog[0] === 1) {
      res.status(200).json({
        response: "Success",
        data: updateLog,
      });
      log(`response (200) : ${JSON.stringify(updateLog)}`);
    } else {
      log(chalk`{bgRed error} 400 - bad request`);
      return res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "Error",
    });
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    id,
    logId
  );

  const deleteQuery = {
    where: {
      id: logId,
      owner_id: id,
    },
  };

  try {
    LogModel.destroy(deleteQuery);
    res.status(200).json({
      response: "Success",
      data: deleteQuery,
    });
    log(chalk`delete confirmed - ${logId}`);
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "Error",
    });
  }
});

module.exports = router;
