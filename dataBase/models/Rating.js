'use strict';

module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            book_id: {
                type: DataTypes.INTEGER
            },
            star: {
                type: DataTypes.INTEGER
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'rating',
            timestamps: false
        });

    const Book = sequelize.import('./Book.js');
    Rating.belongsTo(Book, {foreignKey: 'book_id'});
    return Rating
};