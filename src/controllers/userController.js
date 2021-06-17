const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const MaskData = require("maskdata");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const { UserModel } = require("../models");

const log = console.log;
const maskJSONOptions = {
  maskWith: "*",
  fields: ["password", "passwordhash"],
};

router.post("/register", async (req, res) => {
  let { username, password } = req.body.user;
  const maskedReq = MaskData.maskJSONFields(req.body.user, maskJSONOptions);
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    maskedReq
  );

  try {
    password = bcrypt.hashSync(password, 12);

    const secret = process.env.JWT_SECRET;

    const regUser = await UserModel.create({
      username: username,
      passwordhash: password,
    });

    const maskedUser = MaskData.maskJSONFields(regUser, maskJSONOptions);

    let token = jwt.sign({ id: regUser.id }, secret, { expiresIn: "24h" });

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
    log(`user created - ${JSON.stringify(maskedUser)}`);
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      log(chalk`{bgRed error} 409 - ${err}`);
      return res.status(409).json({
        response: "username in use",
      });
    } else {
      log(chalk`{bgRed error} 500 - ${err}`);
      return res.status(500).json({
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
  const maskedReq = MaskData.maskJSONFields(req.body.user, maskJSONOptions);
  log(
    req.originalUrl,
    req.method === "POST"
      ? chalk.bgBlue(req.method)
      : req.method === "PUT"
      ? chalk.bgYellow(req.method)
      : req.method === "DELETE"
      ? chalk.bgRed(req.method)
      : chalk.bgGreen(req.method),
    JSON.stringify(maskedReq, null, 2)
  );

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
        log(chalk`password check {green ${isCorrectPass}} for ${loginUser.username}`);

        let token = jwt.sign({ id: loginUser.id }, secret, { expiresIn: "48h" });

        const maskedUser = MaskData.maskJSONFields(loginUser, maskJSONOptions);

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
        log(`login success - ${JSON.stringify(maskedUser, null, 2)}`);
      } else {
        log(chalk`{bgRed error} 401 - Unauthorized`);
        return res.status(401).json({
          response: "Unauthorized",
        });
      }
    } else {
      log(chalk`{bgRed error} 401 - Unauthorized`);
      return res.status(401).json({
        response: "Unauthorized",
      });
    }
  } catch (err) {
    log(chalk`{bgRed error} 500 - ${err}`);
    return res.status(500).json({
      response: "login failed",
    });
  }
});

module.exports = router;
