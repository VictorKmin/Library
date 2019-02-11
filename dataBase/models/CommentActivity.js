'use strict';

module.exports = (sequelize, DataTypes) => {
    const CommentActivity = sequelize.define('CommentActivity', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER,
            },
            comment_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            is_create: {
                type: DataTypes.BOOLEAN
            },
            is_update: {
                type: DataTypes.BOOLEAN
            },
            old_comment: {
                type: DataTypes.TEXT
            },
            new_comment: {
                type: DataTypes.TEXT
            },
            created_at: {
                type: DataTypes.DATE
            },
        },
        {
            tableName: 'comment_activity',
            timestamps: false
        });

    const User = sequelize.import('./User.js');
    CommentActivity.belongsTo(User, {foreignKey: 'user_id'});
    return CommentActivity
};