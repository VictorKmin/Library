'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING
            },
            role: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: 'users',
            timestamps: false
        }
    );
    return User
};