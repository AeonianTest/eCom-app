import http from "../http-common"; //import axios config from file

//BOTH METHODS NEED TO BE TESTED
const getProducts = async () => { //method to get all products 
    const response = await http.get('/products'); //get request to api/products, and await it
    return response; //once done return the response: HAVE TO FIGURE OUT HOW TO PARSE
}

const getProductsJoined = async () => { //method to get all products joined to specials
    const response = await http.get('/products/specials'); //get request to api/products/specials
    return response;
} 

//TEST THESE BOTH: UNTESTED
const postUpdateOneSpecial = async (id) => { //method to update one products attribute special bool to true
    const response = await http.post(`/products/special/Boolean/${id}`);
    return response; //return updated product, can be accepted
}

const postResetBool = async () => { //call to reset all products special bools to false
    const response = await http.post(`/products/special/BooleanReset`);
    return response; //return confirmation message
}

export default { //export functions
    getProducts,
    getProductsJoined,
    postUpdateOneSpecial,
    postResetBool
}