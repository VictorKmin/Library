'use strict';

module.exports = (sequelize, DataTypes) => {
    const FullSearch = sequelize.define('FullSearch', {
            book_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            description: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'full_search',
            timestamps: false
        });
    return FullSearch
};