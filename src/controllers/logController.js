const router = require("express").Router();
const debug = require("debug")("http");

const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.post("/", validateJWT, async (req, res) => {
  let endpoint = "POST /log";
  const { id } = req.user;
  const { description, definition, result } = req.body.log;
  debug(`${endpoint} - userID : %o : ${JSON.stringify(req.body.log)}`, id);

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
      debug(`${endpoint} - response (200) : ${JSON.stringify(newLog)}`);
    } else {
      res.status(400).json({
        response: "bad request",
      });
      debug(`${endpoint} - response (400)`)
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
    debug(`${endpoint} - response (500) : ${err}`)
  }
});

router.get("/", validateJWT, async (req, res) => {
  let endpoint = "GET /log";
  const { id } = req.user;
  debug(`${endpoint} - userID : %o`, id);

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
    debug(`${endpoint} - response (200) : ${JSON.stringify(userLogs)}`);
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
    debug(`${endpoint} - response (500) : ${err}`)
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  let endpoint = `GET /log/${req.params.id}`;
  const { id } = req.user;
  const logId = req.params.id;
  debug(`${endpoint} - userID : %o - logId : ${logId}`, id);

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
      debug(`${endpoint} - response (200) : ${JSON.stringify(userLog)}`);
    } else {
      res.status(400).json({
        response: "bad request",
      });
      debug(`${endpoint} - response (400)`)
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
    debug(`${endpoint} - response (500) : ${err}`)
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  let endpoint = `PUT /log/${req.params.id}`;
  const { id } = req.user;
  const logId = req.params.id;
  const { description, definition, result } = req.body.log;
  debug(`${endpoint} - userID : %o - logId : ${logId} - ${JSON.stringify(req.body.log)}`, id);

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
      debug(`${endpoint} - response (200) : ${JSON.stringify(updateLog)}`);
    } else {
      res.status(400).json({
        response: "bad request",
      });
      debug(`${endpoint} - response (400)`)
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
    debug(`${endpoint} - response (500) : ${err}`)
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  let endpoint = `DELETE /log/${req.params.id}`;
  const { id } = req.user;
  const logId = req.params.id;
  debug(`${endpoint} - userID : %o - logId : ${logId}`, id);

  const deleteQuery = {
    where: {
      id: logId,
      owner_id: id,
    },
  };

  try {
    const deleteLog = LogModel.destroy(deleteQuery);

    if (deleteQuery) {
      res.status(200).json({
        response: "Success",
        data: deleteLog,
      });
      debug(`${endpoint} - response (200) : ${JSON.stringify(deleteLog)}`);
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
    debug(`${endpoint} - response (500) : ${err}`)
  }
});

module.exports = router;
