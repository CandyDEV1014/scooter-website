/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */

const db = require("../models");
const config = require("../config/auth.config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.user;
const Op = db.Sequelize.Op;

const JWT_SECRET = config.secret;

exports.getUserList = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  User.findAndCountAll()
    .then((data) => {
      let page = (req.query.page && req.query.page) || 1;
      let sortfield = req.query.sort_by;
      let sortOrder = req.query.descending == "true" ? "DESC" : "ASC";
      let limit = req.query.rows_per_page * 1 || 10;
      let pages = Math.ceil(data.count / limit);
      let offset = limit * (page - 1);
      let search = req.query.search;

      const statement = {};
      if (search) {
        statement[Op.or] = [
          { id: { [Op.like]: "%" + search + "%" } },
          { name: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
          { createdAt: { [Op.like]: "%" + search + "%" } },
          { updatedAt: { [Op.like]: "%" + search + "%" } },
        ];
      }

      User.findAll({
        where: statement,
        limit: limit,
        offset: offset,
        order: [[sortfield || "id", sortOrder || "ASC"]], // fixed at here
      }).then((users) => {
        res.status(200).json({
          status: 1,
          message: "Data has been retrieved",
          result: users,
          count: data.count,
          pages: pages,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 0,
        message: "Data is not retrieved from database",
      });
    });
};

exports.addUser = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((userData) => {
      if (userData) {
        return res.status(400).send({ message: "Email already exists!" });
      }
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync("superadmin", 8),
        roleId: req.body.roleId,
      };

      User.create(data).then((result) => {
        res.status(200).send({ id: result.id });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUserOne = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      res.status(200).json({
        status: 1,
        message: "Data has been retrieved",
        result: user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 0,
        message: "Data is not retrieved from database",
      });
    });
};

exports.updateUser = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const updateValues = {
    name: req.body.name,
    email: req.body.email,
    roleId: req.body.roleId,
  };
  User.update(updateValues, { where: { id: req.body.id } }).then((data) => {
    res.status(200).send(data);
  });
};

exports.updateProfile = (req, res) => {
  User.update(
    {
      name: req.body.name,
      email: req.body.email,
    },
    { where: { email: req.body.email } }
  )
    .then(() => {
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then((userData) => {
        res.status(200).send('success');
      });
    })
    .catch((error) => {
      console.log('error', error);
    });
};

exports.updatePassword = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(" ")[1];
  
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  User.findOne({
    where: {
      id: userId,
    },
  }).then((userData) => {
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      userData.password
    );

    if (!passwordIsValid) {
      return res.status(200).send({
        status: "error",
        message: "Current password is not correct!",
      });
    }

    User.update(
      { password: bcrypt.hashSync(req.body.newPassword, 8) },
      { where: { id: userId } }
    ).then(() => {
      res
        .status(200)
        .send({ status: "success", message: "Password Changed successfully!" });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  User.update({ password: bcrypt.hashSync("superadmin", 8) }, { where: { id: req.body.id } }).then((data) => {
    res.status(200).send(data);
  });
}

exports.deleteUser = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  }).then((data) => {
    res.status(200).send({ message: "Deleted successfully!" });
  });
};
