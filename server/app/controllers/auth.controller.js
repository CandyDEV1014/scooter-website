/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable import/order */
const db = require("../models");
const config = require("../config/auth.config");

const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = config.secret;
const JWT_EXPIRES_IN = 86400;

exports.signin = (req, res) => {
  console.log(req);
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((userData) => {
      if (!userData) {
        return res.status(400).send({ message: "auth/user-not-found" });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userData.password
      );

      if (!passwordIsValid) {
        return res.status(400).send({
          accessToken: null,
          message: "auth/wrong-password",
        });
      }

      const token = jwt.sign(
        { userId: userData.id, companyId: userData.companyId },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN, // 24 hours 86400
        }
      );

      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId,
      };

      res.status(200).send({ user, token });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
