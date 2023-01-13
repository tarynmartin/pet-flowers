module.exports = (sequelize, Sequelize) => {
  const Plant = sequelize.define('plant', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    scientificName: { type: Sequelize.STRING, allowNull: false, unique: true },
    family: Sequelize.STRING,
    popularNames: Sequelize.ARRAY(Sequelize.STRING),
    toxicCats: Sequelize.BOOLEAN,
    toxicDogs: Sequelize.BOOLEAN,
    isFlower: Sequelize.BOOLEAN,
    description: Sequelize.TEXT,
    signs: Sequelize.TEXT,
    // add as assets or web addresses?
    images: Sequelize.ARRAY(Sequelize.STRING),
    link: Sequelize.STRING,
  })
  return Plant;
}