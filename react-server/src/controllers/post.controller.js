//The following snippet is based on Week 8 Practical code Course Material COSC2410 semester 1, 2024.

const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll();

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

//req.body refers to request body, that youd find in the post request
exports.fetch = async (req, res) => {
  const {product_id} = req.query;

  if(!product_id){
    return res.status(400).json({error:'product id is required'});
  }

  const posts = await db.post.findAll({
    where: {
      product_id: product_id,
    },
  })

  res.json(posts);
}

exports.create = async (req, res) =>{
  const post = await db.post.create({
    userID: req.body.userID,
    product_id: req.body.product_id,
    text: req.body.text,
    rating: req.body.rating
  })

  res.json(post);
}
/*
exports.deletePost = async (req, res)=>{
  res.json(  await db.post.destroy({
    where: {
      product_id: req.body.product_id,
      userID: req.body.userID
    },
  }))
}
*/
exports.deletePost = async (req, res) => {
  //try {
    // Perform the delete operation
    const result = await db.post.destroy({
      where: {
        product_id: req.body.product_id,
        userID: req.body.userID,
      },
    });

    res.json(result);
};

exports.editPost = async (req, res) => {
  const result = await db.post.update(
    {
      text: req.body.text,
      rating: req.body.rating
    },
    {
      where:{
        product_id: req.body.product_id,
        userID: req.body.userID,
      }
    }
  )

  res.json(result);
}