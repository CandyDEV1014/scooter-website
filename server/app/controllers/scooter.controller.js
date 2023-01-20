/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */

const db = require("../models");

const multer = require("multer");

const Scooter = db.scooter;
const Op = db.Sequelize.Op;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single("file");

exports.getScooterList = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  Scooter.findAndCountAll()
    .then((data) => {
      let page = (req.query.page && req.query.page) || 1;
      let sortfield = req.query.sort_by;
      let sortOrder = req.query.descending == "true" ? "DESC" : "ASC";
      let limit = req.query.rows_per_page * 1 || 10;
      let pages = Math.ceil(data.count / limit);
      let offset = limit * (page - 1);
      let search = req.query.search;
      let statusId = req.query.status ? req.query.status : null;

      const statement = {};
      if (search) {
        statement[Op.or] = [
          { id: { [Op.like]: "%" + search + "%" } },
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { barcode: { [Op.like]: "%" + search + "%" } },
          { termen: { [Op.like]: "%" + search + "%" } },
          { problem: { [Op.like]: "%" + search + "%" } },
          { price: { [Op.like]: "%" + search + "%" } },
          { createdAt: { [Op.like]: "%" + search + "%" } },
          { updatedAt: { [Op.like]: "%" + search + "%" } },
        ];
      }

      if (statusId) {
        statement.statusId = statusId;
      }

      Scooter.findAll({
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

exports.getScooterOne = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  Scooter.findOne({ where: { id: req.params.id } })
    .then((data) => {
      res.status(200).json({
        status: 1,
        message: "Data has been retrieved",
        result: data,
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

exports.getSearchScooter = (req, res) => {
  Scooter.findAll({
    where: { id: { $regex: req.query.search } },
  })
    .then((users) => {
      res.status(200).json({
        status: 1,
        message: "Data has been retrieved",
        result: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 0,
        message: "Data is not retrieved from database",
      });
    });
};

exports.updateScooter = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const updateValues = {
    name: req.body.name,
    phone: req.body.phone,
    barcode: req.body.barcode,
    model: req.body.model,
    termen: req.body.termen,
    problem: req.body.problem,
    price: req.body.price,
    signature: req.body.signature,
    statusId: req.body.statusId,
  };
  Scooter.update(updateValues, { where: { id: req.body.id } }).then((data) => {
    res.status(200).send(data);
  });
};

exports.uploadSignature = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
};

exports.deleteScooter = (req, res) => {
  Scooter.destroy({
    where: {
      id: req.params.id,
    },
  }).then((data) => {
    res.status(200).send({ message: "Deleted successfully!" });
  });
};

exports.addScooter = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  console.log(req.body);
  Scooter.create(req.body).then((result) => {
    const data = {
      id: result.id,
    };
    res.status(200).send(data);
  });
};

exports.addExcel = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  req.body.forEach((element) => {
    console.log(element);
    Scooter.create(element).then((result) => {
      const data = {
        id: result.id,
      };
    });
  });

  res.status(200).send("successful");
};
