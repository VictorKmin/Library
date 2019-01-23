'use strict';

module.exports = (sequelize, DataTypes) => {
    const BookStat = sequelize.define('BookStat', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            get_time: {
                type: DataTypes.DATE
            },
            back_time: {
                type: DataTypes.DATE
            },
            user_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            }
        },
        {
            tableName: 'bookstat',
            timestamps: false
        });

    const User = sequelize.import('./User.js');
    BookStat.belongsTo(User, {foreignKey: 'user_id'});

    const Book = sequelize.import('./Book.js');
    BookStat.belongsTo(Book, {foreignKey: 'book_id'});
    return BookStat
};