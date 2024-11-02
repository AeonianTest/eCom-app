const { Sequelize, DataTypes } = require("sequelize"); //Import ORM
const config = require("./config.js");

const db = { //Set up Sequelize object
  Op: Sequelize.Op
};

db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, { // Create Sequelize.
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db, DataTypes); //here we send the entire db object
db.products = require("./models/products.js")(db.sequelize, DataTypes);
db.specials = require("./models/specials.js")(db.sequelize, DataTypes);

// Relate many to many using posts as between products and users
db.user.belongsToMany(db.products, { through: db.post, as: "Product_posts", foreignKey: "userID" } ); //SHOULD WORK
db.products.belongsToMany(db.user, { through: db.post, as: "Users_posts", foreignKey: "product_id" } );

//relate one to one, product entry has one specials entry
db.products.hasOne(db.specials, { foreignKey: "product_id", as: "specials" }); //each product has one special through fk product_id

// Include a sync option with seed data logic included.
db.sync = async () => {
  await db.sequelize.sync(); // Sync schema.

  // await db.sequelize.sync({ force: true }); //uncomment and run this to force overwrites of db
  // Forcefully sync db. WARNING THIS IS DESTRUCTIVE: ANY NON SEED DATA WILL BE WIPED ON THIS RUNNING
  
  await seedDataUser(); //Call the seeder functions to populate with needed base data
  await seedDataProducts();
  await seedDataPosts();
  await seedDataSpecials();
};

async function seedDataUser() { //NOTE THIS SEED ONLY GOES FOR USER TABLE. We want to seed for all neccecary ideally
  const count = await db.user.count(); //Get user entries

  if (count > 0) // Only seed data if necessary.
    return;

  const argon2 = require("argon2"); //Import hasher

  let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({ username: "mbolger", password_hash: hash, user_bio: "hello world123", date_joined: "12-12-2012", user_email: "mbolger@gmail.com", user_address: "123 Test Street" });

  hash = await argon2.hash("def456", { type: argon2.argon2id });
  await db.user.create({ username: "shekhar", password_hash: hash, user_bio: "foo bar 123", date_joined: "11-11-2012", user_email: "skalra@gmail.com", user_address: "321 Foo Blvd"});
}

async function seedDataProducts() {
  const count = await db.products.count();

  if (count > 0)
    return;

  await db.products.bulkCreate([
    { product_id: 1, product_name: "product 1", price: 3.10, info: "product 1 info", special_bool: true },
    { product_id: 2, product_name: "product 2", price: 8.60, info: "product 2 info", special_bool: true },
    { product_id: 3, product_name: "product 3", price: 9.60, info: "product 3 info", special_bool: true },
    { product_id: 4, product_name: "product 4", price: 5.00, info: "product 4 info", special_bool: false },
    { product_id: 5, product_name: "product 5", price: 21.85, info: "product 5 info", special_bool: false },
    { product_id: 6, product_name: "product 6", price: 4.50, info: "product 6 info", special_bool: false },
    { product_id: 7, product_name: "product 7", price: 7.20, info: "product 7 info", special_bool: false },
    { product_id: 8, product_name: "product 8", price: 9.50, info: "product 8 info", special_bool: false },
  ]);
}

async function seedDataPosts() { //PLEASE NOTE: A USER CANNOT REVIEW THE SAME PRODUCT TWICE
  const count = await db.post.count();

  if (count > 0)
    return;

  await db.post.bulkCreate([ //Testing functions
    { userID: "1", product_id: 1, text: "Test 1 mbolger", rating: 3 },
    { userID: "1", product_id: 2, text: "Test 2 mbolger", rating: 2 },
    { userID: "2", product_id: 1, text: "Test 1 shekhar", rating: 5 },
    { userID: "2", product_id: 2, text: "Test 2 shekhar", rating: 4 },
  ]);
}

async function seedDataSpecials() { //seed specials data WIP
  const count = await db.specials.count();

  if (count > 0)
    return;

  await db.specials.bulkCreate([ //Bulk create linked specials to products, through product_id
    { 
      specials_id: 1, discount: 0.2, 
      specials_info: "Specials 1, discount 0.2",
      product_id: 1
    }, 
    { 
      specials_id: 2, discount: 0.15, 
      specials_info: "Specials 2, discount 0.15", 
      product_id: 2
    },
    { 
      specials_id: 3, discount: 0.5, 
      specials_info: "Specials 3, discount 0.5", 
      product_id: 3
    },
    { 
      specials_id: 4, discount: 0.2, 
      specials_info: "Specials 4, discount 0.2", 
      product_id: 4
    },
    { 
      specials_id: 5, discount: 0.3, 
      specials_info: "Specials 5, discount 0.3", 
      product_id: 5
    },
    { 
      specials_id: 6, discount: 0.4, 
      specials_info: "Specials 6, discount 0.4", 
      product_id: 6
    },
    { 
      specials_id: 7, discount: 0.2, 
      specials_info: "Specials 7, discount 0.2", 
      product_id: 7
    },
    { 
      specials_id: 8, discount: 0.1, 
      specials_info: "Specials 8, discount 0.1", 
      product_id: 8
    }
  ]);
}

module.exports = db;
