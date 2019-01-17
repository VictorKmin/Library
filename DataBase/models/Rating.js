'use strict';

module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userid: {
                type: DataTypes.INTEGER
            },
            bookid: {
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