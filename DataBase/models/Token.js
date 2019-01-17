'use strict';

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userid: {
                type: DataTypes.INTEGER
            },
            token: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'token',
            timestamps: false
        });
    return Token
};