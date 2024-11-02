// import React, { useEffect, useState } from "react";
// import { initSpecials, generateDaysSpecials, getSpecials, initDay, getDay, setDay } from "../data/specialsData";
// import GardenInfo from "../fragments/GardenInfo";

// /*
//     THIS PAGE IS BEING CHANGED TO BROWSE.JS FOR PRODUCTS & SPECIALS
//     PAGE BEING DEPRECATED
// */


// function Special() { 
//     //all funcs called run on every component mounting (ie when this component loaded)
//     initSpecials(); //Initialise the specials into memory if not already. 
//     initDay(); //Put day in localStorage if not already there

//     //Rework in progress
//     const date = new Date(); //date object to use     
//     const [specials, setSpecials] = useState(getSpecials()); //state var for the specials for the day. trigger getSpecials, setting shuffling specials, and getting the first 3 vals into weekspecials 
//     const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//     if (getDay() !== date.getDay()) { //if day doesnt match, change it
//         console.log(getDay(), " dont match ", date.getDay()); //change these to getDay()
//         setDay(date.getDay());
//         generateDaysSpecials();
//         setSpecials(getSpecials());
//     }

//     /* //Old
//     useEffect(() => {
//         //console.log("time is ", day); //test print for trigger
//         //generateDaysSpecials();
//         //setSpecials(getSpecials()); //set specials state to new list

//         return () => { //return func
//             setDay(date.getDay());
//             console.log("Running cleanup. Time is ", day);
//         }
//     }, [day]); //on trigger when date.getDay gives a new day value
//     */

//     return ( //Layout of the specials page
//         <div className="specials-body">
//             <div id="specials-title">
//                 <h1>Standard and Special products</h1>
//             </div>
//             <div id="flex-container-specials-outer">
//                 <div className="specials-box-column">
//                     <h1>Todays Specials!</h1>
//                     <ul>
//                         <li>TODO: Combine specials w Products</li>
//                         <li>Make that obvious here</li>
//                     </ul>
//                     <p>Offers limited to {days[date.getDay()]} only.</p>
//                     { //dynamically map array of items to screen
//                         specials.map((special) => (<p className="week-specials" key={special.key}>
//                             {special.info}
//                         </p>))
//                     }
//                 </div> 
//                 <div className="specials-box-column"> test </div>
//                 { /* Removing Farming feature from Specials as per specs <div className="specials-box-column"> <GardenInfo/> </div> */}
//             </div>
//         </div>
//     );
// }

// export default Special;

