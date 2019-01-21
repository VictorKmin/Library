'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.STRING
            },
            comment: {
                type: DataTypes.TEXT
            },
            created_at: {
                type: DataTypes.DATE
            },
        },
        {
            tableName: 'comments',
            timestamps: false
        });
    return Comments
};