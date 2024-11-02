import http from "../http-common";


//i dont really know what this is supposed to be doing so if
//there is an error, its probably something to do with this.
const get = id =>{
    return http.get(`/reviews/${id}`);
}

const create = data => {
    console.log(data);
    return http.post("/posts", data);
}

const fetch = product_id =>{
    return http.get("/posts/fetch/", {params: {product_id}});
}

const deletePost = data =>{
    console.log("data",data);
    return http.post("/posts/delete", data);
}

const editPost = data=>{
    console.log("data",data);
    return http.post("/posts/edit", data)
}

export default {
    create,
    get,
    fetch,
    deletePost,
    editPost
};