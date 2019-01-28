'use strict';

module.exports = (sequelize, DataTypes) => {
    const DigitalInfo = sequelize.define('DigitalInfo', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: DataTypes.INTEGER,
                foreignKey: true
            },
            type_of_file: {
                type: DataTypes.STRING
            },
            type_of_content: {
                type: DataTypes.STRING
            },
            location: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'digital_info',
            timestamps: false
        });

    const Book = sequelize.import('./Book.js');
    DigitalInfo.belongsTo(Book, {foreignKey: 'book_id'});
    return DigitalInfo
};