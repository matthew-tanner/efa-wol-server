const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.post("/", validateJWT, async (req, res) => {
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
    } else {
      res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
  }
});

router.get("/", validateJWT, async (req, res) => {
  const { id } = req.user;

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
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;

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
    } else {
      res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;
  const { description, definition, result } = req.body.log;
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

    if (updateLog) {
      res.status(200).json({
        response: "Success",
        data: updateLog,
      });
    } else {
      res.status(400).json({
        response: "bad request",
      });
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  const logId = req.params.id;
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
    }
  } catch (err) {
    res.status(500).json({
      response: "Error",
    });
  }
});

module.exports = router;
