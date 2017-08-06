module.exports = {
  up: function(queryInterface, Sequelize) {
    return(queryInterface.addColumn('posts', 'imageFilename', {
      type:         Sequelize.STRING,
      allowNull:    false,
      defaultValue: ''
    }));
  },

  down: function(queryInterface, Sequelize) {
    return(queryInterface.removeColumn('posts', 'imageFilename'));
  }
};