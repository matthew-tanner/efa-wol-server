const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

const validateJWT = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  }
  
  try{
    if (req.headers.authorization && req.headers.authorization.includes("Bearer")) {
      const { authorization } = req.headers;
      const payload = authorization
        ? jwt.verify(
            authorization.includes("Bearer") ? authorization.split(" ")[1] : authorization,
            process.env.JWT_SECRET
          )
        : undefined;
  
      if (payload) {
        let foundUser = await UserModel.findOne({
          where: { id: payload.id },
        });
        if (foundUser) {
          req.user = foundUser;
          next();
        } else {
          res.status(400).send({ message: "Not authorized" });
        }
      } else {
        res.status(401).send({ messaage: "Invalid token" });
      }
    } else {
      res.status(403).send({ message: "forbidden" });
    }
  }catch(err){
    res.status(500).send({message: err})
  }

};

module.exports = validateJWT;
