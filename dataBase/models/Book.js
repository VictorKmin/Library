'use strict';

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING
            },
            author: {
                type: DataTypes.STRING
            },
            is_digital: {
                type: DataTypes.BOOLEAN
            },
            summary: {
                type: DataTypes.TEXT
            },
            tags: {
                type: DataTypes.TEXT
            },
            subject: {
                type: DataTypes.STRING
            },
            user_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            publisher: {
                type: DataTypes.STRING
            },
            image: {
                type: DataTypes.TEXT
            },
            is_reading: {
                type: DataTypes.BOOLEAN
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'book',
            timestamps: false
        });

    const User = sequelize.import('./User.js');
    Book.belongsTo(User, {foreignKey: 'user_id'});
    return Book
};