const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("http");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const { UserModel } = require("../models");

router.post("/register", async (req, res) => {
  let endpoint = "/register";
  let { username, password } = req.body.user;
  debug(`${endpoint} - username:%o`, req.body.user.username);
  try {
    password = bcrypt.hashSync(password, 12);
    debug(`${endpoint} - password for %o hashed`, username);

    const secret = process.env.JWT_SECRET;

    const regUser = await UserModel.create({
      username: username,
      passwordhash: password,
    });
    debug(`${endpoint} - user created for %o`, regUser.username);

    let token = jwt.sign({ id: regUser.id }, secret, { expiresIn: "48h" });
    debug(`${endpoint} - token generated for %o`, regUser.username);

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
    debug(`${endpoint} - response (200)`);
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        response: "username in use",
      });
      debug(`${endpoint} - response (409) : ${err}`)
    } else {
      res.status(500).json({
        response: "registration failed",
        data: {
          error: err,
        },
      });
      debug(`${endpoint} - response (500) : ${err}`)
    }
  }
});

router.post("/login", async (req, res) => {
  let endpoint = "/login";
  let { username, password } = req.body.user;
  debug(`${endpoint} - username:%o`, req.body.user.username);

  try {
    const secret = process.env.JWT_SECRET;
    const loginUser = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (loginUser) {
      debug(`${endpoint} - user found for %o`, loginUser.username);
      const isCorrectPass = await bcrypt.compare(password, loginUser.passwordhash);

      if (isCorrectPass) {
        debug(`${endpoint} - password check success`);

        let token = jwt.sign({ id: loginUser.id }, secret, { expiresIn: "48h" });
        debug(`${endpoint} - token generated for %o`, loginUser.username);

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
        debug(`${endpoint} - response (200)`)
      } else {
        res.status(401).json({
          response: "Unauthorized",
        });
        debug(`${endpoint} - response (401)`)
      }
    } else {
      res.status(401).json({
        response: "Unauthorized",
      });
      debug(`${endpoint} - response (401)`)
    }
  } catch (err) {
    res.status(500).json({
      response: "login failed",
    });
    debug(`${endpoint} - response (500) : ${err }`)
  }
});

module.exports = router;
