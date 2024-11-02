module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/user/:userID", controller.one);

  // Select one user from the database if username and password are a match.
  router.get("/login", controller.login);

  //find user by username
  router.get("/findByUsername", controller.findByUsername);

  // Create a new user.
  router.post("/", controller.create);
  
  router.post("/update", controller.update);

  router.post("/delete/:userID", controller.deleteUser);

  // Add routes to server.
  app.use("/api/users", router);
};
