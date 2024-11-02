import React from "react";
import homebg from "../homebg.mp4";
import { Link } from "react-router-dom";

//Homepage video sourced from Pexels under Pexels free content license. https://www.pexels.com/license/ 

function Home(props) {
  return (
    <div id="flex-container">
      <div className="home-top">
        <h1 className="home-title">eCom</h1>
      </div>


      <video className='videoBg' autoPlay loop muted>
        <source src={require("../homebg.mp4")} type='video/mp4' />
      </video>
      <div className="home-bottom">

        {props.username ? 
        (<Link to="/cart"><button className="home-link-button">Shopping</button></Link>)
        :
        (<Link to="/login"><button className="home-link-button">Get Started</button></Link>)}

        <Link to="/browse"><button className="home-link-button">Products</button></Link>

      </div>
    </div>
  );
}

export default Home;
