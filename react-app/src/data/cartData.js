/*
    This page is responsible for handling cart related data, and containing functions to loan
*/

const LOCALSTORAGE_KEY = "cartLocal"; //local temp storage
const PRODUCELIST_KEY = "ProduceList"; // The options to be displayed to screen

function initProduceList() { //init the database of options of produce items
    const produceList = [
        {
            ID: 1,
            Name: "Apple",
            Carbs: "25g",
            Nutrition: "High in Fiber and Vitamin C",
            Price: 1.10
        },
        {
            ID: 2,
            Name: "Broccoli",
            Carbs: "7g",
            Nutrition: "High in Fiber and Vitamin C and A",
            Price: 1.60
        },
        {
            ID: 3,
            Name: "Carrot",
            Carbs: "12g",
            Nutrition: "High in Fiber, Vitamin K1 and Beta-carotene",
            Price: 0.60
        },
        {
            ID: 4,
            Name: "Spinach",
            Carbs: "1g",
            Nutrition: "High in Iron contents",
            Price: 5.00
        },
        {
            ID: 5,
            Name: "Banana",
            Carbs: "29g",
            Nutrition: "Rich in Potassium and Vitamin B6",
            Price: 0.85
        },
        {
            ID: 6,
            Name: "Tomato",
            Carbs: "6g",
            Nutrition: "Plenty of Vitiman C and Potassium contents",
            Price: 2.50
        },
        {
            ID: 7,
            Name: "Strawberries",
            Carbs: "8g",
            Nutrition: "Antioxidants and high Manganese",
            Price: 4.00
        },
        {
            ID: 8,
            Name: "Blackberries",
            Carbs: "8g",
            Nutrition: "High in Vitiman C and Manganese",
            Price: 4.00
        }
    ];

    if (localStorage.getItem(PRODUCELIST_KEY) !== null) { //if produceList already exists in localStorage, exit normally
        return; //exit
    }

    //else push it to localStorage overwriting
    localStorage.setItem(PRODUCELIST_KEY, JSON.stringify(produceList));
    return;
}

function getProduceList() { //Get the list of Produce items from local. Should only need the read side of things
    return JSON.parse(localStorage.getItem(PRODUCELIST_KEY));
}

function getcartLocal() { //get cartLocal, which represents the cart at the current moment of time loaded by user
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
}

function setcartLocal(cart) { //set cartLocal, which represents the cart at the current moment of time loaded by user
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cart));
}

export {
    initProduceList,
    getProduceList,
    getcartLocal,
    setcartLocal
};