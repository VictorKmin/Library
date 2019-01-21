'use strict';

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            token: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'auth_access',
            timestamps: false
        });
    return Token
};