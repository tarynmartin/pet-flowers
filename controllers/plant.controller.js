// knowledge from here: https://www.bezkoder.com/node-express-sequelize-postgresql/#Update_an_object

const db = require('../models');
const Plant = db.plant;
// Op is operators being imported as symbols
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.scientificName) {
    res.status(400).send({
      message: "Scientific Name can not be empty!"
    });
    return;
  }
  // Create a plant
  const plant = {
    scientificName: req.body.scientificName,
    family: req.body.family,
    popularNames: req.body.popularNames,
    toxicCats: req.body.toxicCats,
    toxicDogs: req.body.toxicDogs,
    isFlower: req.body.isFlower,
    description: req.body.description,
    signs: req.body.signs,
    // add as assets or web addresses?
    images: req.body.images,
    link: req.body.link,
  };
  // Save Plant in the database
  Plant.create(plant)
    .then(data => {
      // how to prevent duplicates being created?
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Plant."
      });
    });
};
exports.update = (req, res) => {
  const { id } = req.body;
  console.log('check', id, req.params, req.body);
  Plant.update(req.body, {
    where: { id: id}
  }).then(num => {
    if (num == 1) {
        res.send({
          message: "Plant was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update plant with id=${id}. Maybe plant was not found or req.body is empty!`
        });
      }
  }).catch(err => {
      res.status(500).send({
        message: "Error updating plant with id=" + id
      });
    })
}
exports.findAll = (req, res) => {
  Plant.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants."
      });
    });
};
exports.findOne = (req, res) => {
  const id = req.params.id;
  Plant.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Plant with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Plant with id=" + id
      });
    });
};
// Delete a Plant with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Plant.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Plant was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Plant with id=${id}. Maybe Plant was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Plant with id=" + id
      });
    });
};
// Delete all Plants from the database.
exports.deleteAll = (req, res) => {
  Plant.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Plants were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all plants."
      });
    });
};

exports.findAllToxicToCats = (req, res) => {
  Plant.findAll({ where: { toxicCats: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants toxic to cats."
      });
    });
};

exports.findAllToxicToDogs = (req, res) => {
  Plant.findAll({ where: { toxicDogs: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants toxic to dogs."
      });
    });
};

exports.findAllToxicToBoth = (req, res) => {
  Plant.findAll({ where: { toxicCats: true, toxicDogs: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants toxic to cats and dogs."
      });
    });
};

exports.findAllNonToxicToCats = (req, res) => {
  Plant.findAll({ where: { toxicCats: false } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants non-toxic to cats."
      });
    });
};

exports.findAllNonToxicToDogs = (req, res) => {
  Plant.findAll({ where: { toxicDogs: false } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants toxic to dogs."
      });
    });
};

exports.findAllNonToxicToBoth = (req, res) => {
  Plant.findAll({ where: { toxicCats: false, toxicDogs: false } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plants non-toxic to cats and dogs."
      });
    });
};

exports.findAllFlowersNonToxicToCats = (req, res) => {
  Plant.findAll({ where: { isFlower: true, toxicCats: false }})
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving flowers non-toxic to cats"
        });
      });
}

exports.findAllFlowersNonToxicToDogs = (req, res) => {
  Plant.findAll({ where: { isFlower: true, toxicDogs: false }})
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving flowers non-toxic to dogs"
        });
      });
}

exports.findAllFlowersNonToxicToBoth = (req, res) => {
  Plant.findAll({ where: { isFlower: true, toxicCats: false, toxicDogs: false }})
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving flowers non-toxic to cats and dogs"
        });
      });
}