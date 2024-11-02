import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser, getUserDetails } from "../data/data";
import { Link } from "react-router-dom";
import ErrorMessage from "../fragments/ErrorMessage";
import AccountDataService from "../services/AccountService.js";

//TODO: signup function
// use regex to check if given string matches all criteria.
// use states to return error states 

//at least 8 characters
// at least one lowercase
// at least one uppercase
// contains at least one digit
// contains at least one symbol



function Signup(props) {


// state hook declaration
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);
  const [confirmState, setConfirmState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [fields, setFields] = useState({email: "", username: "", password: "", confirmPassword: ""});
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);

  const [user, setUser] = useState();


  //state hook to be used for regex validation
  const [validated, setValidate] = useState([
    {name: 'lowercase', value: false},
    {name: 'uppercase', value: false},
    {name: 'length', value: false},
    {name: 'digit', value: false},
    {name: 'symbol', value: false}
  ]);


  // function that encompasses all handling of input fields on the submit page
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    //updates fields state to be used for form submission
    const temp = {email: fields.email, username: fields.username, password: fields.password, confirmPassword: fields.confirmPassword};
    temp[name] = value;
    //console.log(submitButtonPressed);
    setFields(temp);

    //console.log(temp);

    //makes confirm password error only appear when user hits the register button
    //we dont access the fields state variables here because of how asynchronous logic works; the output lags
    if(submitButtonPressed){

      if (name === 'confirmPassword'){
        if (value === fields.password){
          //when passwords match, error will disappear
          setConfirmState(false);
        }
        else{
          setConfirmState(true);
        }
      }
    }

    console.log("confirm", confirmState);

    console.log(fields);
  }

  //password validation function
  function validatePassword(password){

    //retrieves the password value from input box
    password = password.target.value;

    //maps maps validated state variable to validateState
    const validateCategory = validated.map((validateState) =>{
      //console.log('State:', validated);
      //console.log(password);
      

      // tests the password for each criteria using regex.
      switch (validateState.name){
        case 'lowercase':
          return {...validateState, value: RegExp("(?=.*[a-z])").test(password)};
        case 'uppercase':
          return { ...validateState, value: RegExp("(?=.*[A-Z])").test(password) };
        case 'length':
          return { ...validateState, value: (password.length >= 8)};
        case 'digit':
          return { ...validateState, value: RegExp("(?=.*\\d)").test(password)};
        case 'symbol':
          return { ...validateState, value: RegExp("(?=.*\\W)").test(password)};
        default:
          return validateState;
      }
    });
    setValidate(validateCategory);
  }


    const passwordHandler = (event) =>{
      handleInputChange(event);
      validatePassword(event);
    }



    //TODO: ensure password input border turns black when password meets all criteria
    function passwordValidated(validated){
      let valid = true;
      const validateCategory = validated.map((validateState)=>{
        if (validateState.value === false){
          valid = false;
        }
      });

      if(valid ===true){
        setPassState(false);
      }
      else{
        setPassState(true);
      }
      //console.log(valid);
      return valid;
    }



    //submit handler function
    const handleSubmit = async (event) =>{
      event.preventDefault();
      setSubmitButtonPressed(true);

      /*
      if(getUserDetails(fields.username)){
        setUserExists(true);
        console.log("exists");
        //prevents signup if user exists
        return;
      }*/

      if(passwordValidated(validated)){
        if (fields.password === fields.confirmPassword){

          //date code based on solution by Samuel Meddows on Stack Overflow
          let today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); 
          var yyyy = today.getFullYear();
        
          let tempDateJoined = dd + '-' + mm + '-' + yyyy;
          let tempEmail;
          let tempUser;
          let tempPass;
          tempEmail = fields.email;
          tempUser = fields.username;
          tempPass = fields.password;

          //ALWAYS come back to this any time a new user property is being added
          // even if not directly set on signup page, just assign it a null value
          let userTemplate = 
          {
            email: tempEmail,
            username: tempUser,
            password: tempPass,
            dateJoined: tempDateJoined,
            address: null,
            dob: null,
            dietPlan: null
          };


          // initialUserState sets the values for the creation of user data to be used in the database
          const initialUserState =
          {
            username: tempUser,
            password_hash: tempPass,
            date_joined: tempDateJoined,
            user_email: tempEmail
          };

          setUser(initialUserState);

          await AccountDataService.create(initialUserState)
          
            .then(response => {
              setUser({
                username: response.username,
                password_hash: response.password_hash,
                date_joined: response.date_joined,
                user_email: response.user_email
              });
              console.log(response.data);
              console.log(setUser);
            })
            .catch(e => {
              console.log(e);
            });
            
          //signUpUser(userTemplate);
          props.loginUser(fields.username); //put in localStorage

          navigate("/"); //Navigate to home page
          return;
        }
        else{
          //activates confirm password error
          setConfirmState(true);
        }
      }
      else{
        //TODO add password error handler
        setPassState(true);
      }
    }

    return (
        <div className="signup-main">
        <form className="signup-box" onSubmit = {handleSubmit}>
            <h1>Sign Up</h1>
            <div className="input-field">
              <label>Email</label>
              <input name="email" id="email" className = "signup-input-field" type="email" onChange={handleInputChange} required = "true"/>
            </div>
            <div className="input-field">
              <label>Username</label>
              <input name="username" id="username" className = "signup-input-field" type="text" onChange={handleInputChange} value={fields.username} required="true"/>
            </div>
            <div className="input-field">
              <label>Password</label>
              <input style={{border: passState && '1px solid red'}}name="password" id="password" className = "signup-input-field" type="password" onChange={(event)=>passwordHandler(event)}/>
              {validated.map((item) => {
                // iterates through state variable and outputs based on the state of current iteration
                // depending on the state's respective boolean value, either sets style to red or none
                let content;
                if (item.name === 'lowercase') {
                  content = <span style = {item.value === false ? { color:"red" }: {display:"none"}}>Password must contain a lowercase letter.</span>;
                } else if (item.name === 'uppercase') {
                  content = <span style = {item.value === false ? { color:"red" }: {display:"none"}}>Password must contain an uppercase letter.</span>;
                } else if (item.name === 'length'){
                  content = <span style = {item.value === false ? { color:"red" }: {display:"none"}}>Password must be at least 8 characters in length.</span>;
                } else if (item.name === 'digit'){
                  content = <span style = {item.value === false ? { color:"red" }: {display:"none"}}>Password must contain a digit.</span>;
                } else if (item.name ==='symbol'){
                  content = <span style = {item.value === false ? { color:"red" }: {display:"none"}}>Password must contain a symbol.</span>;
                }

                return (
                  <div className = "validation-text" key={item.name}>
                    {content}
                  </div>
                );
              })}

                
            </div>
            <div className="input-field">
              <label>Confirm Password</label>
              <input style={{border: confirmState && '1px solid red'}}name="confirmPassword" id="confirmPassword" className = "signup-input-field" type="password" onChange={handleInputChange} />
              {confirmState && (
                <div className = "validation-text">
                  <span style={{color:'red'}}>Passwords do not match.</span>
                </div>
              )}
            </div>
            <button className="signup-submit" type="submit">
             Register
             </button>
            <div className="register-link">
              <span>Already have an account? <Link to="/login">Log in.</Link></span>
            </div>
        </form>
        {userExists && <ErrorMessage message="User already exists"/>}
    </div>
    )
}

export default Signup;
