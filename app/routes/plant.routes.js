module.exports = app => {
  const plants = require("../../controllers/plant.controller");
  let router = require("express").Router();

  router.get('/', plants.findAll);
  router.post('/', plants.create)
  router.get('/:id', plants.findOne);
  router.delete('/:id', plants.delete);
  router.get('/toxic/cats', plants.findAllToxicToCats);
  router.get('/toxic/dogs', plants.findAllToxicToDogs);
  router.get('/toxic/both', plants.findAllToxicToBoth);
  router.get('/non-toxic/cats', plants.findAllNonToxicToCats);
  router.get('/non-toxic/dogs', plants.findAllNonToxicToDogs);
  router.get('/non-toxic/both', plants.findAllNonToxicToBoth);
  router.get('/flowers/cats', plants.findAllFlowersNonToxicToCats);
  router.get('/flowers/dogs', plants.findAllFlowersNonToxicToDogs);
  router.get('/flowers/both', plants.findAllFlowersNonToxicToBoth);
  app.use('/api/plants', router);
}