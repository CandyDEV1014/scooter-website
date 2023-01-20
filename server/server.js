const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8080'
  // origin: 'http://164.92.68.61/'
};

app.use(cors());
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// path
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

// database
const db = require('./app/models');

const Role = db.role;
const Status = db.status;
const User = db.user;

const { ROLES, STATUS } = db;

// eslint-disable-next-line no-unused-vars
function initial() {
  // user roles initialize ...
  ROLES.forEach((role) => {
    Role.create({
      name: role
    });
  });
  
  // scooter status initialize ...
  STATUS.forEach((status) => {
    Status.create({
      name: status
    });
  });

  // admin setting
  User.create({
    id: 1,
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    roleId: 1,
    password: bcrypt.hashSync('superadmin', 8)
  });
}

// db.sequelize.sync().then(() => {
//   initial();
// });

// force: true will drop the table if it already exists

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/scooter.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
