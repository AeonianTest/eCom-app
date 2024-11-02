/*
  This page is responsible for handling all data for Specials
*/

//PAGE BEING DEPRECATED IN FAVOUR OF browseData.js

const SPECIALS_KEY = "specials";
const WEEKSPECIALS_KEY = "weekSpecials"; //use this to contain data for current specials of the day
const DAY_KEY = "day";

function initSpecials () { //Initialise the total list of Specials into localStorage.
  const specials = [
    {
      key: 0, //unique value to use as key
      info: "Fresh Produce day! Get 20% off select products from our fresh produce isle. \
      Organic Produce sourced domestically from your local Australian farmers. \
      Enjoy fresh vegetables and fruits fit for a healthy diet!"
    },
    {
      key: 1,
      info: "Get 15% off the total price of any bundle of 3 gardening tools bought from our Hardware section, \
      including rakes, spades, fences and more! \
      Contribute to a greener and more sustainable future today by investing in tools perfect for backyard gardening projects of any scope."
    },
    {
      key: 2,
      info: "Spruce up your own garden today with a 10% discount on any purchases from SOILs wide range of \
      plant starts, organic compost, healthy seeds and feed. \
      Take the time to expand your self reliance and vegetable crops today only!"
    },
    {
      key: 3,
      info: "Get a quick morning wake up for an productive early start to your days with 30% off on our selection \
      of premium roasted coffee beans from diverse types. Brew the perfect espresso or Latte, \
      offer stands for today only."
    },
    {
      key: 4,
      info: "Enjoy some discounted dairy products, with a 10% discount on any dairy product sold at our shops. \
      Dairy offers numerous nutritional benefits, providing everyone an essential source of calcium, \
      protein and vitamins core to our everyday wellbeing."
    },
    {
      key: 5,
      info: "Indulge with a 20% price reduction on all of our cold pressed drinks, produced with fresh \
      fruits and vegetables on the moment of purchase. Give yourself the essential boost of energy, sustenance \
      and mental clarity in order to tackle your day on the best terms."
    },
    {
      key: 6,
      info: "Spice up your meals with todays 15% price deduction on your purchases of herbs. \
      Beyond providing yourself a culinary enhancement of flavour and aroma, they \
      provide numerous health boosting qualities of antioxidants, anti-inflammatory benefits \
      and more!"
    }
  ];

  if (localStorage.getItem(SPECIALS_KEY) !== null) { //if specials already exists in localStorage, exit
    //console.log(JSON.stringify(specials));
    return; //exit
  }

  //else push it to localStorage
  //console.log("pushing to local ", specials);
  localStorage.setItem(SPECIALS_KEY, JSON.stringify(specials));
  return;
}

function initDay() {//intialise day in local if not there aready
  const date = new Date(); //date object to use 

  if (localStorage.getItem(DAY_KEY) !== null) {
    return;
  }

  localStorage.setItem(DAY_KEY, date.getDay().toString()); //change this to getDay
  return;
}

//This function is an implemenation of the common modern fisher-yates algorithm for randomly shuffling an array of values

function shuffleArray(array) {
  for (let i = array.length - 1;i > 0; i--) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randIndex]] = [array[randIndex], array[i]];
  }

  return array;
}

function generateDaysSpecials() { //Generate randomly a list of three specials shuffled from main
  const specialsArrayAll = JSON.parse(localStorage.getItem(SPECIALS_KEY)); //get the entire array of specials
  const shuffledArray =  shuffleArray(specialsArrayAll); //shuffle it
  const specialArray = shuffledArray.slice(0, 3); //slice it seperatly cause otherwise swamped with errors
  //here we get the first three elements of the shuffled array, so its random every time

  //console.log(specialArray); //test
  localStorage.setItem(WEEKSPECIALS_KEY, JSON.stringify(specialArray)); //overwrite whatever is given by the WEEKSPECIALS_KEY key in storage, giving new spliced array
  localStorage.setItem(SPECIALS_KEY, JSON.stringify(shuffledArray));
  return specialArray;
}

function getSpecials() { //get the three spliced elements
  console.log("getSpecials triggered"); //test print

  if (localStorage.getItem(WEEKSPECIALS_KEY) !== null) { //if weekspecials exists
    const weekSpecials = localStorage.getItem(WEEKSPECIALS_KEY);
    return JSON.parse(weekSpecials);
  }
  
  const specialsEntireArray = JSON.parse(localStorage.getItem(SPECIALS_KEY)); //else crib the first three from the entire array
  return specialsEntireArray.slice(0, 3);
}

//Cant use rerending logic on all this
function getDay() {
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

export { //export functions
  initSpecials,
  initDay,
  generateDaysSpecials,
  getSpecials,
  getDay,
  setDay
};