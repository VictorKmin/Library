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
                foreignKey: true
            },
            comment_id: {
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
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
    const Book = sequelize.import('./Book.js');
    CommentActivity.belongsTo(User, {foreignKey: 'user_id'});
    CommentActivity.belongsTo(Book, {foreignKey: 'book_id'});

    return CommentActivity
};