//Model responsible for holding data on products displayed in cart

/*
    TODO: 
        Specials will from now be derived from products
        Second 1 to 1 table for specials ?
*/  

module.exports = (sequelize, DataTypes) =>
    sequelize.define("products", {
        product_id: { //PK id
            type: DataTypes.INTEGER, //int column
            autoIncrement: true, //unique value for each entry
            primaryKey: true, //PK of the table.
            allowNull: false //no null values
        },
        product_name: { //name of the product
            type: DataTypes.STRING(20), //varchar(20) EDIT AS NECESSARY
            allowNull: false //no null values
        },
        price: { //price of the product
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false //no null values
        },
        info: { //Assorted fun facts
            type: DataTypes.STRING(1000), //varchar(1000) EDIT AS NECESSARY
            allowNull: false //no null values
        },
        special_bool: { //Bool for front end usage. wont need to write to here
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
        /* 
            MAY NEED LTR
                More explicit bool between special and not if plan doesnt work
                Info on images? idk how they work lol
        */
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });