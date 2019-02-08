'use strict';

module.exports = (sequelize, DataTypes) => {
    const ReadingActivity = sequelize.define('ReadingActivity', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            book_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            take_read: {
                type: DataTypes.BOOLEAN
            },
            continue_read: {
                type: DataTypes.BOOLEAN
            },
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

    const Book = sequelize.import('./Book.js');
    ReadingActivity.belongsTo(Book, {foreignKey: 'book_id'});
    return ReadingActivity
};