'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            bookid: {
                type: DataTypes.INTEGER
            },
            authorid: {
                type: DataTypes.STRING
            },
            fulldate: {
                type: DataTypes.STRING
            },
            comment: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'comments',
            timestamps: false
        });
    return Comments
};