//File responsible for mounting the API requests available for products table

module.exports = (express, app) => { //import stuff
    const controller = require("../controllers/products.controller.js"); //import API methods
    const router = express.Router(); //import a route to mount

    router.get("/", controller.all); //on mounted root, get request all products

    router.get("/specials", controller.allJoin); //get inner join of all products and specials

    router.post("/special/Boolean/:id", controller.updateOneSpecial); //Update one products special boolean to true

    router.post("/special/BooleanReset", controller.resetBool); //reset all special bools to false

    app.use("/api/products", router); //mount the api outline relative to port root
};