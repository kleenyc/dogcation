module.exports = function(sequelize, DataTypes) {
  return(sequelize.define('comment', {
    body: {
      type:      DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please share your comment'
        }
      }
    },
    author: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter your name'
        }
      }
    },
    postId: {
      type:      DataTypes.TEXT,
      allowNull: false,
      }
 
  }, {
    defaultScope: {
      order: [['createdAt', 'DESC']]
    },
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.post);
      }
    }
  }));
};