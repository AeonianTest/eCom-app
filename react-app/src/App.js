import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup.js'
import Login from './pages/Login';
import Browse from './pages/Browse.js';
import Profile from './pages/Profile.js';
import ShoppingCart from './pages/ShoppingCart.js';
import ShoppingResults from './pages/ShoppingResults.js';
import Navbar from './fragments/Navbar';
import Footer from './fragments/Footer';
//import CreditForm from './fragments/CreditForm.js';

import { useState } from 'react';
import { getUser, removeUser, setUser, setUserID } from './data/data.js'

function App() {
  const [username, setUsername] = useState(getUser()); //State variable recording what user is logged in, if there is one
  const [cartResults, setCartResults] = useState(null); //use this to send data to shoppingResults
  const [totalCartPrice, setTotalCartPrice] = useState(null); //use this for total price in shoppingResults
  //console.log("Username is: ", username); //Testprint. Should be null if not logged in.

  const loginUser = (username) => { 
    console.log('loginUser');
    setUser(username);
    setUserID(username);
    setUsername(username); //set state varaible to username function. To pass into components
  }

  const logoutUser = () => { //Remove username from localStorage and set state var null, function
    removeUser();
    setUsername(null);
  }

  return (
    <>
      <div>
        <Router>
          <Navbar username={username} logoutUser={logoutUser}/>
          <main role="main">
            <div>
              <Routes>
                <Route path="/" element={<Home username={username}/>} />
                <Route path="/login" element={<Login loginUser={loginUser} />} /> 
                <Route path="/signup" element={<Signup loginUser={loginUser}/>}/>
                <Route path="/browse" element={<Browse/>}/>
                <Route path="/profile" element={<Profile username={username} logoutUser={logoutUser}/>}/>
                <Route path="/cart" element={<ShoppingCart setCartResults={setCartResults} setTotalCartPrice={setTotalCartPrice}/>}/>
                {/*<Route path="/dietplan" element={<DietPlan username={username}/>}/>*/}
                <Route path="/shoppingresults" element={<ShoppingResults cartResults={cartResults} totalCartPrice={totalCartPrice}/>}/>
                {/*<Route path="/creditform" element={<CreditForm/>}/>*/}
              </Routes>
            </div>
          </main>
          <Footer/>
        </Router>
      </div>
    </>
  );
}

export default App;
