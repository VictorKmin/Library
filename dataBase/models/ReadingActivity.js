'use strict';

module.exports = (sequelize, DataTypes) => {
    const ReadingActivity = sequelize.define('ReadingActivity', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            book_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            // true when user take book for reading
            // default : false
            take_read: {
                type: DataTypes.BOOLEAN
            },
            // true when user want read book after notification on email
            // default : false
            continue_read: {
                type: DataTypes.BOOLEAN
            },
            // true when user get back book to office
            // default : false
            get_back: {
                type: DataTypes.BOOLEAN
            },
            created_at: {
                type: DataTypes.DATE
            },
        },
        {
            tableName: 'reading_activity',
            timestamps: false
        });

    const User = sequelize.import('./User.js');
    const Book = sequelize.import('./Book.js');
    ReadingActivity.belongsTo(User, {foreignKey: 'user_id'});
    ReadingActivity.belongsTo(Book, {foreignKey: 'book_id'});

    return ReadingActivity
};