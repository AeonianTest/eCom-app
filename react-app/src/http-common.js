import axios from "axios"; //import axios, wrapper for API fetching

export default axios.create({ //default axios object
    baseURL: "http://localhost:4000/api", //base url to mount custom logic to
    headers: {
        "Content-type": "application/json"
    }
});