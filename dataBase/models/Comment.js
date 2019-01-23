'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            comment: {
                type: DataTypes.TEXT
            },
            created_at: {
                type: DataTypes.DATE
            },
        },
        {
            tableName: 'comments',
            timestamps: false
        });

    const User = sequelize.import('./User.js');
    Comment.belongsTo(User, {foreignKey: 'user_id'});
    return Comment
};