'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orderdishes', 'option_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orderdishes', 'option_id');
  }
};
