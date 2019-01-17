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
            who_add: {
                type: DataTypes.INTEGER
            },
            publisher: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'book',
            timestamps: false
        });
    return Book
};