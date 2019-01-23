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
            type_of_content: {
                type: DataTypes.STRING
            },
            type_of_book: {
                type: DataTypes.STRING
            },
            type_of_file: {
                type: DataTypes.STRING
            },
            summary: {
                type: DataTypes.TEXT
            },
            tags: {
                type: DataTypes.STRING
            },
            subject: {
                type: DataTypes.STRING
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            publisher: {
                type: DataTypes.STRING
            },
            image: {
                type: DataTypes.TEXT
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