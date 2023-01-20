const controller = require('../controllers/user.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/user', controller.getUserList);
  app.get('/api/user/:id', controller.getUserOne);
  app.post('/api/user', controller.addUser);
  app.put('/api/user', controller.updateUser);
  app.post('/api/user/resetPassword', controller.resetPassword);
  app.post('/api/user/updateProfile', controller.updateProfile);
  app.post('/api/user/updatePassword', controller.updatePassword);
  app.delete('/api/user/:id', controller.deleteUser);
};
