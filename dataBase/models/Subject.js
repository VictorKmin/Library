'use strict';

module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            subject: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: 'subjects',
            timestamps: false
        });
    return Subject
};