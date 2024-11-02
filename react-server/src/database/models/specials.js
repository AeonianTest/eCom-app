//use this as a joined table on hip to products, 1 to 1. 
//For normalisation purposes
//Shouldnt need routers and controllers, should be able to query using product api

module.exports = (sequelize, DataTypes) =>
    sequelize.define("specials", {
        specials_id: { //explicit PK
            type: DataTypes.INTEGER, //int column
            autoIncrement: true, //unique value for each entry
            primaryKey: true, //PK of the table.
            allowNull: false //no null values
        },
        discount: { //discount of the product as a special
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false //no null values
        },
        specials_info: {
            type: DataTypes.STRING(1000), //varchar(1000) EDIT AS NECESSARY
            allowNull: false //no null values
        }
        //FK is added here by index.js associations
        /* 
            MAY NEED LTR
                CONFIRM THIS WORKS I GUESS
        */
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });