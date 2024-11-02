//PAGE IS WIP W LOGIN PAGE
//The following snippet is based on Week 3 Ex. 6 Course Material COSC2410 semester 1, 2024.

/*
  This pages handles the management of user related data
*/

import axios from "axios";
import PostDataService from "../services/PostService";

//const USERS_KEY = "users"; //list of users as objects
const USER_KEY = "user"; //currently logged in user that is verified as real, refer to localStorage
const API_HOST = "http://localhost:4000";
// Initialise local storage "users" with data, if the data is already set this function returns immediately.

/*
function initUsers() { //I believe this runs even if not called?
  
  const users = [ // User data is hard-coded in array of objects, passwords are in plain-text. Default values to init users key.
    {
      username: "mbolger",
      password: "abc123"
      //date joined
      //Info
      //Diet plan(?)
    },
    {
      username: "shekhar",
      password: "def456"
    },
    {
      username: "testUser",
      password: "testPass"
    }
  ];

  if (localStorage.getItem(USERS_KEY) !== null) { //Stop if data is already initialised in localStorage.
      //console.log(JSON.stringify(users)); //test print
      return;
  }

  // Else set data into the local storage else
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return;
}
*/

/*
function signUpUser(newUser) { //Add user to localStorage list of objects of users. TODO: TEST THIS
  const usersList = JSON.parse(localStorage.getItem(USERS_KEY));
  usersList.push(newUser); //push new object to the end of the list
  localStorage.setItem(USERS_KEY, JSON.stringify(usersList)); //(Hopefully) overwrite the users localStorage with the new item.

  return;
}*/
/*
function updateElement(username, element, value){
  const users = getUsers();
  //var usersList = JSON.parse(localStorage.getItem(USERS_KEY));
  for (const user of users){
    if (username === user.username){
      user[element] = value;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
  return;
}*/

/*
function deleteUser(username){
  const users = getUsers();

  for (const user of users){
    if (username === user.username){
      //deletes users by filtering the target user and creating a new json.
      const updatedUsers = users.filter((user) => user.username !== username);
      
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    }
  }
  return;
}*/
/*
function getUsers() { //extract list of valid users from localStorage, parse into objects
  const data = localStorage.getItem(USERS_KEY);
  return JSON.parse(data);
} //User in user verification func?
*/
//revise to remove localstorage.
/*
function getUserDetails(username)
{
  const users = getUsers();

  for (const user of users) { //iterates through each user object in list
    if (username === user.username){
      let email = user.email;
      let name = user.username;
      let password = user.password;
      let userDateJoined = user.dateJoined;
      let userAddress = user.address;
      let userDob = user.dob;
      let userDietPlan = user.dietPlan;
      //fetches all user details ^

      //use array index to retrieve data from userDetails array
      // email: userDetails[0];  password: userDetails[3], etc.
      let userDetails = [email, name, password, userDateJoined, userAddress, userDob, userDietPlan]; //assigns all user details from JSON to array.

      //console.log(userDetails.toString());

      return userDetails;
      
    }
  }
}*/

async function getUserID(username) {
  const response = await axios.get(API_HOST + "/api/users/findByUsername", { params: {username}});
  //const user = response.data;
  const userID = response.data.userID;

  //console.log(response.data.userID);

  return userID;
}

async function getUsername(userID){
  try{
    const response = await axios.get(API_HOST + `/api/users/user/${userID}`);
    const username = response.data.username;
    //console.log("data",response.data);

    return username;
  }catch(error){
    console.log("error finding username", error.response);
  }

}

async function getUserData(userID){
  const response = await axios.get(API_HOST + `/api/users/user/${userID}`);
  return response.data;
}

async function getReviews(product_id){
  const response = await axios.get(API_HOST + "/api/posts/fetch/",{params:{product_id}});

  return response.data;
}

async function verifyUser(username, password) { //Verify user against list of registered user accounts. //WIP
  const response = await axios.get(API_HOST + "/api/users/login", { params: { username, password} });
  const user = response.data;
  //console.log(user != null);
  if (user != null ){
    return true;
  }
  else{
    console.log("error; user not found");
    return;
  }
}

function setUser(username) {
  localStorage.setItem(USER_KEY, username); //Put in localStorage the current user logged in
  //console.log("user set");
}

async function setUserID(username) {
  const userID = await getUserID(username)
  localStorage.setItem("userID", userID);
}

function getUser() {
  //console.log("user get");
  return localStorage.getItem(USER_KEY); //Get value (name) of user, if not there return null
}

function getLocalUserID(){
  return localStorage.getItem("userID")
}

function removeUser() {
  localStorage.removeItem(USER_KEY); //remove user key value pair from localStorage
}
/*
async function deletePost(userID, product_id){
  await PostDataService.deletePost(userID, product_id);
}*/


export { //export all functions that will be used outside of this file.
  verifyUser,
  getUser,
  removeUser,
  setUser,
  getUserID,
  getReviews,
  getUsername,
  setUserID,
  getUserData,
  getLocalUserID
};