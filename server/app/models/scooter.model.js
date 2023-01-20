module.exports = (sequelize, Sequelize) => {
  const Scooter = sequelize.define('scooter', {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    barcode: {
      type: Sequelize.STRING
    },
    model: {
      type: Sequelize.STRING
    },
    termen: {
      type: Sequelize.STRING
    },
    problem: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    },
    signature: {
      type: Sequelize.STRING
    },
    statusId: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  });

  return Scooter;
};
