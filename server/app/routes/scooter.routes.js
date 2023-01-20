const controller = require('../controllers/scooter.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // --------------------- Scooter CRUD section --------------------------------------------------------------
  app.get('/api/scooter', controller.getScooterList);
  app.get('/api/scooter/:id', controller.getScooterOne);
  app.post('/api/scooter', controller.addScooter);
  app.post('/api/scooter/excel', controller.addExcel);
  app.post('/api/scooter/uploadSignature', controller.uploadSignature);
  app.put('/api/scooter', controller.updateScooter);
  app.delete('/api/scooter/:id', controller.deleteScooter);
  
  // -----------------------------------------------------------------------------------
};
