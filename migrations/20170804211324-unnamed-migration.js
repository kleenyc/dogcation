'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('posts', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
        allowNull:     false
      },
      title: {
        type:      Sequelize.STRING,
        allowNull: false
      },
      body: {
        type:      Sequelize.TEXT,
        allowNull: false
      },
      author: {
        type:      Sequelize.STRING,
        allowNull: false
      },
      link: {
        type:      Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('posts');
  }
};