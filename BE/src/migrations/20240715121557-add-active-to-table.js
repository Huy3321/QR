'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Table_names', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true, // Mặc định là true (bật)
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Table_names', 'active');
  }
};
