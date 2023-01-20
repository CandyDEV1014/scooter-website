/* eslint-disable array-callback-return */
const Sequelize = require('sequelize');
const config = require('../config/db.config.js');

// const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
//   host: config.HOST,
//   dialect: config.dialect,
//   operatorsAliases: 0,
//   port: config.PORT,
//   pool: {
//     max: config.pool.max,
//     min: config.pool.min,
//     acquire: config.pool.acquire,
//     idle: config.pool.idle
//   }
// });

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  dialect: config.dialect,
  port: config.PORT,
  host: config.HOST,
  operatorsAliases: 0,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.status = require('./status.model.js')(sequelize, Sequelize);
db.scooter = require('./scooter.model.js')(sequelize, Sequelize);

db.ROLES = ['admin', 'member', 'user'];
db.STATUS = ['IN LUCRU', 'FINALIZAT', 'IESIT'];

db.EMAIL_API_KEY =
  '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';

module.exports = db;
