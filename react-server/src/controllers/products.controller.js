//File responsible for handling products related server requests

const db = require("../database"); //require DB for methods

//ADD CRUD OPERATIONS AND MORE AS NEEDED

//Select all products from database
exports.all = async (req, res) => {
    const products = await db.products.findAll(); //get all products from db

    res.json(products); //send response object the json of the products
};

//select all products from databsse joined with corresponding specials
exports.allJoin = async (req, res) => {
    const productsJoined = await db.products.findAll({ //get all products joined to 
        include: { model: db.specials, as: "specials" },
    });

    res.json(productsJoined);
};

exports.updateOneSpecial = async (req, res) => { //Update one products special boolean to true
    const product = await db.products.findByPk(req.params.id); //get specific product by id
    product.special_bool = true; //set the parameter to true

    await product.save(); //update the product

    res.json(product); //send back the product singular as well
};

exports.resetBool = async (req, res) => {
    for (let i = 0; i < await db.products.count(); ++i) { //for number of products
        const product = await db.products.findByPk(i + 1); //get specific product by id

        product.special_bool = false; //reset the bool
        await product.save(); //update the product
    }

    res.json("Reset special bools"); //confirmation response, if needed
}