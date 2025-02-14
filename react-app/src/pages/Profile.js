import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalUserID, getUserData } from "../data/data";
import AccountDataService from "../services/AccountService";
import ErrorMessage from '../fragments/ErrorMessage';

//TODO: create separate password submit button from the general info submit button.
// use states to keep the values of email, address and date of birth
// write handleinput function that updates fields statehook

function Profile(props){
    const navigate = useNavigate();
    const [viewState, setViewState] = useState(true);
    const [passState, setPassState] = useState(false);
    const [confirmState, setConfirmState] = useState(true);
    const [passwordInteracted, setPasswordInteracted] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const [fields, setFields] = useState({email: "", address: "", bio: "", password: "", confirmPassword: ""});
    const [userData, setUserData] = useState();

    if (!props.username){
        navigate("/login");
    }

    //TODO test errormessage functionality by creating another box
    //see if useeffect is not working correctly

    //password validation categories (imported from signup)
    const [validated, setValidate] = useState([
        {name: 'lowercase', value: false},
        {name: 'uppercase', value: false},
        {name: 'length', value: false},
        {name: 'digit', value: false},
        {name: 'symbol', value: false}
      ]);
      
    const temp= {...fields}['email'];

    const seedUserData = async ()=>{
      const response = await getUserData(getLocalUserID())

      const tempUserData=
      {
        username: response.username,
        date_joined: response.date_joined,
        user_email: response.user_email,
        user_bio: response.user_bio,
        user_address: response.user_address
      };

      console.log(tempUserData);

      setUserData(tempUserData);
      //console.log("userData",userData);
    }

    useEffect(()=>{
      seedUserData();
    },[])


    useEffect(()=>{
      console.log("userData",userData);
      // only enters fields if userData is
      if(userData){
        setFields({email: userData.user_email, address: userData.user_address});
      };

    },[userData]);

    console.log(temp);
    //validates password based on regex
    function validatePassword(password){

        password = password.target.value;
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

      
    //same logic as signup page
    function passwordValidated(){
        let valid = true;
        const validateCategory = validated.map((validateState)=>{
          if (validateState.value === false){
            valid = false;
          }
        });

        //all this does is determine whether the password is valid or not
        // if not, see handlePasswordSubmit
        if(valid ===true){
          setPassState(false);
        }
        else{
          setPassState(true);
        }
        //console.log(valid);
        return valid;
      }
    
    //input change handler function
    const handleInputChange = (event) =>{
      const name = event.target.name;
      const value = event.target.value;

      const temp = {...fields};
      temp[name] = value;
      setFields(temp);

    }
  

    console.log(fields);

    //handles the different functions that need to execute when password box is typed into
    function handlePasswordChange(event){
      // this state hook makes the password criteria text only appear when the box is typed into, so that it looks neater.
      setPasswordInteracted(true);
      handleInputChange(event);
      validatePassword(event);
    }
    
    const handleSubmit= async (event)=>{
      event.preventDefault();

      const tempUserData=
      {
        passwordBool: false,
        userID: getLocalUserID(),
        user_email: fields.email,
        user_bio: fields.bio,
        user_address: fields.address,
      };

      await AccountDataService.update(tempUserData);
      
      seedUserData();
      /*
      updateElement(props.username, 'address', fields.address);
      updateElement(props.username, 'email', fields.email);
      */


      setViewState(true);
    }
    
    const handlePasswordSubmit=async(event)=>{
      event.preventDefault();
      passwordValidated();

      //if passState is false, updates password
      if (!passState){
        if (fields.confirmPassword === fields.password){
          const tempUserData=
          {
            passwordBool: true,
            userID: getLocalUserID(),
            user_password: fields.password
          };

          await AccountDataService.update(tempUserData);
          seedUserData();
          //updateElement(props.username, 'password', fields.password);
          setConfirmState(true);
          setViewState(true);

        }

        //if passState is true, shows confirm password error
        else{
          setConfirmState(false);
          setErrorMessageVisible(true);
        }
      }

    }

    //statehook used to conditionally render the delete prompt when a user wishes to delete their account.
    const [deletePromptOpen, setDeletePromptOpen] = useState(false);

    function deletePrompt(){

      return (
      <div>
        <div className="deletePrompt">
          <h3>Delete your account?</h3>
          <div>
            <button onClick={async()=>{
              await AccountDataService.deleteUser(getLocalUserID());
              props.logoutUser();
              navigate("/");
              }}>Yes</button>
            <button onClick={()=>{
              setDeletePromptOpen(false);
            }}>No</button>
          </div>
        </div>
          <div className="blackout">
        </div>
      </div>);
    };
    
    return (
        <div className="profile-container">
            <div className="profile-content">
                  <h1 className="profile-header">My Account</h1>
                  <div className="edit-button-row">
                  <button className="profile-edit-button" onClick={()=>{
                  viewState ? setViewState(false) : setViewState(true);
                  }}>{viewState ? <span>Edit</span> : <span>Cancel</span>}</button>

                  {/*ignore the fact im using an arrow function in every onclick it fixed a bug and I dont know how*/}
                  {!viewState && <button onClick={()=>{setDeletePromptOpen(true)}}>Delete</button>}
                  {deletePromptOpen && deletePrompt()}
                  </div>
                  
                  <div>
                      <hr/>
                  </div>

                
                {viewState && (
                    <div>
                        <div className="profile-top">
                        <img className="profile-pfp" alt="generic pfp" src={require("../userimg.png")}></img>
                            <div id="datejoined">
                                <span className="profile-name">{userData ? userData.username : <span>Loading...</span>}</span>
                                <h3>Date Joined: {userData ? userData.date_joined : <span>Loading...</span>}</h3>
                            </div>
                        </div>
                        
                        <div className = "profile-edit-left">
                            <h3>Email</h3>
                            <span>{userData ? userData.user_email : <span>Loading...</span>}</span>
                            <h3>Address</h3>
                            {(userData && (userData.user_address !== null)) ? userData.user_address : <span>N/A</span>}

                        </div>
                    </div>
                )}
                {!viewState && (
                    <div>
                        <div className="profile-top">
                        
                         <img className="profile-pfp" alt="generic pfp" src={require("../userimg.png")}></img> {/*User icon from https://icons8.com/*/}
                            <div id="datejoined">
                                <span className="profile-name">{userData ? userData.username : <span>Loading...</span>}</span>
                                <h3>Date Joined: {userData ? userData.date_joined : <span>Loading...</span>}</h3>
                            </div>
                        </div>
                        <div name="profile-edit" className="profile-edit">
                            <div className = "profile-edit-flex">
                                <form className="profile-edit-left" onSubmit={handleSubmit}>
                                    <label><h3>Email</h3></label>
                                    <input name = "email" value={fields.email} onChange={handleInputChange} default = {userData && userData.user_email} type="email"></input>
                                    <label><h3>Address</h3></label>
                                    <input name="address" value = {fields.address} onChange={handleInputChange} default={userData && userData.user_address} type="text"></input>

                                    <button type="submit">Update Details</button>
                                </form>
                                <form className = "password-form" onSubmit={handlePasswordSubmit}>
                                  <div className = "profile-edit-right">
                                      <label><h3>Password</h3></label>
                                      <input name="password" value={fields.password} onChange={handlePasswordChange} type="password"></input>
                                      {passwordInteracted &&
                                      validated.map((item) => {
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
                                      <label><h3>Confirm Password</h3></label>
                                      <input name="confirmPassword" value={fields.confirmPassword} onChange={handleInputChange} type="password"></input>
                                      {!confirmState && <ErrorMessage message="Passwords do not match."/>}
                                      <button type="submit">Update Password</button>
                                  </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default Profile;