'use strict';

module.exports = (sequelize, DataTypes) => {
    const BookStat = sequelize.define('BookStat', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER
            },
            get_time: {
                type: DataTypes.DATE
            },
            back_time: {
                type: DataTypes.DATE
            },
            user_id: {
                type: DataTypes.INTEGER
            }
        },
        {
            tableName: 'bookstat',
            timestamps: false
        });
    return BookStat
};