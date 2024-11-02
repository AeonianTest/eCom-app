module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);

  router.get("/fetch", controller.fetch);

  router.post("/", controller.create);

  router.post("/delete", controller.deletePost);
  // Add routes to server.

  router.post("/edit", controller.editPost);
  
  app.use("/api/posts", router);
};
