const express = require("express"); //Importing API framework + crossorigin support
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const db = require("./src/database"); //databse object to model it
const graphql = require("./src/graphql");

// Database will be sync'ed in the background.
db.sync(); //sync our model against the actual, overwriting any differeneces

const app = express(); //API app
app.use(express.json()); // Parse requests of content-type - application/json.
app.use(cors()); // Add CORS suport.

//Mount graphql support
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphql.schema,
    rootValue: graphql.root,
    graphiql: true
  })
);

app.get("/", (req, res) => { //Testing root route
  res.json({ message: "Testing root route. Hello!" });
});

// Add table models routes.
require("./src/routes/user.routes.js")(express, app);
require("./src/routes/post.routes.js")(express, app);
require("./src/routes/products.routes.js")(express, app);

//WIP: SET UP OUR DB SCHEMA THEN our table models

const PORT = 4000; // Set port, listen for requests.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
