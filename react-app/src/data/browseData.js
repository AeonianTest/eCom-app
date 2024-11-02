/*
  This page is responsible for ancillary data operations for " Standard and Special products", Browse.js and derivatives
*/

import ProductServices from "../services/ProductServices"

const DAY_KEY = "day";

function initDay() { //intialise day in local if not there aready
    const date = new Date(); //date object to use 
  
    if (localStorage.getItem(DAY_KEY) !== null) { //if date already exists
      return;
    }
  
    localStorage.setItem(DAY_KEY, date.getDay().toString());  //else set day
    return;
}

function getDay() { //Get day from local storage
    if (localStorage.getItem(DAY_KEY) !== null) { //if day exists check just incase
      const day = localStorage.getItem(DAY_KEY);
      return parseInt(day);
    } 
  
    console.log("ERROR: Day doesnt exist"); //else print this
    return -1;
}

function setDay(day) {
    localStorage.setItem(DAY_KEY, day.toString());
    return;
}

//UNTESTED: WIP
async function genDaySpecials() { //when new day comes and this is called, randomly select three products to be the specials. This operate async
  const response = (await ProductServices.getProductsJoined()).data; //wait till we retrieve the products
  const shuffledProductsArray = shuffleArray(response); //shuffle the array
  await ProductServices.postResetBool(); // reset all Products to not special 

  // console.log("shuffledProductsArray is ", shuffledProductsArray); //TESTING DEL LTR
  // console.log("ID of first element is ", shuffledProductsArray[0].product_id);

  await ProductServices.postUpdateOneSpecial(shuffledProductsArray[0].product_id); //set first three products in shuffled array to Special in db
  await ProductServices.postUpdateOneSpecial(shuffledProductsArray[1].product_id);
  await ProductServices.postUpdateOneSpecial(shuffledProductsArray[2].product_id);
}

//This function is an implemenation of the common modern fisher-yates algorithm for randomly shuffling an array of values
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randIndex]] = [array[randIndex], array[i]];
    }
  
    return array;
}

export { //export functions
    initDay,
    getDay,
    setDay,
    genDaySpecials
}