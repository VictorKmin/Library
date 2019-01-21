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
            }
        },
        {
            tableName: 'rating',
            timestamps: false
        });
    return Rating
};