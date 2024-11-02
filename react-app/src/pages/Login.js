import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../data/data";
import { Link } from "react-router-dom";

//The following snippet is based on Week 3 Ex. 6 Course Material COSC2410 semester 1, 2024.

function Login(props) {
  const [fields, setFields] = useState({ username: "", password: "" }); //state variable (object) for the current vars in field
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => { //Generic form change handler. Updates state fields every change in form fields
    const name = event.target.name; //Get name of the field changed
    const value = event.target.value; //get the new value of the field

    const temp = { username: fields.username, password: fields.password }; //get state var of field into tempory object

    // Update field and state.
    temp[name] = value; //update relevant attribute in object
    console.log(temp); //test print
    setFields(temp); //Update state var with new value
  }

  const handleSubmit = async (event) => { //handle submission of form
    event.preventDefault(); //stop default get request so we can use JS
    console.log(fields.username, " ", fields.password);

    const verified = await verifyUser(fields.username, fields.password); //verify user data provided against state object fields
    //console.log(verified);
    if (verified === true) { //if real user
      props.loginUser(fields.username); //put in localStorage

      navigate("/"); //Navigate to home page
      return;
    }
    else{
      console.log("verified false");
    }

    //Else reset fields password field to blank
    const temp = { ...fields };
    temp.password = "";
    setFields(temp); //by setting state fields to change, we reset values rendered in form

    setErrorMessage("Username and or password invalid, please try again."); // Set error message.
  }

  return (
    <div className="login-main">
        <form className="login-box" onSubmit={handleSubmit}>
            <h1>Log In</h1>
            <div className="input-field">
              <label>Username</label>
              <input name="username" id="username" className = "login-input-field" type="text" value = {fields.username}
              onChange = {handleInputChange}/>
            </div>
            <div className="input-field">
              <label>Password</label>
              <input name="password" id="password" className = "login-input-field" type="password" value = {fields.password}
              onChange = {handleInputChange}/>
            </div>
            {errorMessage !== null &&
              <div className="error-message">
                <span >{errorMessage}</span>
              </div>
            }
            <button className="login-submit" type="submit">Log In</button>
            <div className="register-link">
              <span>Don't have an account? <Link to="/signup">Sign up.</Link></span>
            </div>
        </form>
    </div>
  );
}

export default Login; 
