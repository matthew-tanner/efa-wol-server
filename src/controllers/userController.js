const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const { UserModel } = require("../models");

router.post("/register", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    password = bcrypt.hashSync(password, 12);
    const secret = process.env.JWT_SECRET;

    const regUser = await UserModel.create({
      username: username,
      passwordhash: password,
    });

    let token = jwt.sign({ id: regUser.id }, secret, { expiresIn: "48h" });

    res.status(200).json({
      response: "registration successful",
      data: {
        user: {
          id: regUser.id,
          username: regUser.username,
        },
        sessionToken: token,
      },
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        response: "username in use",
      });
    } else {
      res.status(500).json({
        response: "registration failed",
        data: {
          error: err,
        },
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    const secret = process.env.JWT_SECRET;
    const loginUser = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (loginUser) {
      const isCorrectPass = await bcrypt.compare(password, loginUser.passwordhash);

      if (isCorrectPass) {
        let token = jwt.sign({ id: loginUser.id }, secret, { expiresIn: "48h" });

        res.status(200).json({
          response: "login successful",
          data: {
            user: {
              id: loginUser.id,
              username: loginUser.username,
            },
            sessionToken: token,
          },
        });
      } else {
        res.status(401).json({
          response: "Unauthorized",
        });
      }
    } else {
      res.status(401).json({
        response: "Unauthorized",
      });
    }
  } catch (err) {
    res.status(500).json({
      response: "login failed",
    });
  }
});

module.exports = router;
