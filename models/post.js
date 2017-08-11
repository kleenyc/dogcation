module.exports = function(sequelize, DataTypes) {
    return (sequelize.define('post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter a one word title of your dogcation'
                }
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please share your Dogcation story'
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your name'
                }
            }
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter a link from your dogcation experience'
                }
            }
        },
        imageFilename: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        }
    }, {
        defaultScope: {
            order: [
                ['createdAt', 'DESC']
            ]
        },
        getterMethods: {
            url: function() {
                return (`/story/${this.title}`);
            },
            imageUrl: function() {
                return (`https://s3.amazonaws.com/dogcation/posts/${this.id}`);
            },
            imageThumbnailUrl: function() {
                return (`${this.imageUrl}-thumbnail`);
            }
        },
        classMethods: {
            associate: function(models) {
                models.post.hasMany(models.comment);
            },
            findOne: function(title) {
                return (this.findOne({
                    where: {
                        title: title
                    },
                    include: [
                        sequelize.models.comment
                    ],
                    order: [
                        [sequelize.models.comment, 'createdAt', 'DESC']
                    ]
                }));
                    console.log(title)
            }
        }
    }));
};