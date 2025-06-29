'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductOptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shape: {
        type: Sequelize.ENUM('square', 'circle'),
        defaultValue: 'square',
        allowNull: false
      },
      radius: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('text', 'color'),
        defaultValue: 'text',
        allowNull: false
      },
      values: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductOptions');
  }
};