'use strict';

module.exports = (sequelize, DataTypes) => {
    const BookStat = sequelize.define('BookStat', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            bookid: {
                type: DataTypes.INTEGER
            },
            get_time: {
                type: DataTypes.STRING
            },
            bac_time: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'bookstat',
            timestamps: false
        });
    return BookStat
};