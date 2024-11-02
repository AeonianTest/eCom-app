import http from "../http-common";

const get = userID =>{
    return http.get(`/users/user/${userID}`, {params:{userID}});
};

const findByUsername = username =>{
    return http.get("/users/findByUsername", {params: {username}});
};

const create = data => {
    return http.post("/users", data);
}

const login = data =>{
    return http.get("/login", data);
}

const update = data=>{
    return http.post("/users/update", data);
}

const deleteUser = userID =>{
    return http.post(`users/delete/${userID}`, {params:{userID}});
}

export default {
    get,
    create,
    login,
    findByUsername,
    update,
    deleteUser
};