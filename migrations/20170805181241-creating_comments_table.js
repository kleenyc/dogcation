module.exports = {
  up: function(queryInterface, Sequelize) {
    return(queryInterface.createTable('comments', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
        allowNull:     false
      },
      postId: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        onDelete:  'cascade',
        references: {
          model: 'posts',
          key:   'id'
        }
      },
      body: {
        type:      Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type:      Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type:      Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    }));
  },

  down: function(queryInterface, Sequelize) {
    return(queryInterface.dropTable('comments'));
  }
};