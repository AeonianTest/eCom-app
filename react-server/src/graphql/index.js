const { buildSchema } = require("graphql");
const db = require("../database");

const graphql = { };

//WIP
// Cosntructing a schema, using GraphQL schema language
graphql.schema = buildSchema(`
    #GraphQL types

    #Default product, joined to 1 type Special
    type Product {
        product_id: Int,
        product_name: String,
        price: Float,
        info: String,
        special_bool: Special
    }

    #Special type, attached to a Product
    type Special {
        specials_id: Int,
        discount: Float,
        specials_info: String
    }

    #WIP: Add user type later. Not sure how to block a user so might not attempt.

    #Defining the queries, Read operations
    type Query {
        view_products_joined: [Product]
    }

    #Defining the mutations, Write operations
    #type Mutation {
        #add_Product(input: Product): Product,
        #edit_Product(input: Product): Product,
        #delete_Product(product_id: Int): Product,
    #}
`);

module.exports = graphql;

// The root provides a resolver function for each API endpoint.

graphql.root = {
    //Queries
    view_products_joined: async () => {
        return productsJoined = await db.products.findAll({ 
            include: { model: db.specials, as: "specials" },
        }); 
    },

    //Mutations

    //MAKE SUBMITTING PRODUCTS JUST TWO SUBMISSIONS ? IDK FIGURE IT OUT
};

/*
    Example Query
    {
        view_products_joined {
            product_name
        }
    }
*/ 