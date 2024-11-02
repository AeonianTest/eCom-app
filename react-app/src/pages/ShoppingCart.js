import { useEffect, useState } from "react";
import AddCartForm from "../fragments/AddCartForm";
import CartViewForm from "../fragments/CartViewForm";
import CreditForm from "../fragments/CreditForm";
import { getcartLocal, setcartLocal } from "../data/cartData"; //Phasing out product methods here
import { initDay, getDay, setDay,  genDaySpecials } from "../data/browseData" //Replacing with these methods
import ProductServices from "../services/ProductServices"

/* The following snippet is based on Week 4 Ex. 4 Course Material COSC2410 semester 1, 2024.
    WIP REFACTORING TO DB API

    TODO: 
        HOW MUCH TO HOOK UP TO DB?
*/

function ShoppingCart({ setCartResults, setTotalCartPrice }) { 
    const [cart, setCart] = useState([]); //What records all the items at the current moment in the cart
    const [products, setProducts] = useState([]); //List of products, set intially to empty array
    const [displayCreditForm, setDisplayCredit] = useState(false); //to display credit form or not
    const [totalPrice, setTotalPrice] = useState(null); //Use state to hold total price, force update when changed

    initDay(); //Put day in localStorage if not already there
    const date = new Date(); //date object to use  

    const fetchData = async () => { //func to fetch data for use in State. REF W8 LEC E1
        try { 
            const response = await ProductServices.getProductsJoined(); //get products joined w specials
            return response.data; //return the data
        } catch (err) {
            console.log(err);
            return []; //return empty array on err
        }
    }

    const setNewData = async () => { //async function wrapper called on found new day to shuffle specials
        await genDaySpecials(); // reset bools, then set three products randomly to Specials through their bool, will have to fetch data again
        const response = await fetchData();

        setProducts([...response]); //Call the asnychonus function setProducts
    }

    const addItem = (item) => { //Add an item to the cart state var. item is just a string
        const tempCart = cart.filter((element) => element[0] !== item); //create cart from cart elements that doesnt contain the item name
        const itemIfExists = cart.filter((element) => element[0] === item); //Check if item name exists, if so make it the variable (?)

        const itemMatchCheck = (element) => element[0] === item; //Call back function to check list for matching

        if (itemIfExists.length !== 0) {
            itemIfExists[0][1] += 1; //Hacky syntax because technically this array length is 2
            const newCart = cart; //get cart mutable
            newCart[cart.findIndex(itemMatchCheck)] = itemIfExists[0]; //change index of item to updated

            setCart([...newCart]);
        }
        else { //Else no duplicates

            //Get product Id and special_bool
            let product_id;
            let product_special_bool;

            for (let i = 0; i < products.length; ++i) {

                if (products[i].product_name === item) {
                    product_id = i + 1; //get product id
                    product_special_bool = products[i].special_bool;
                }
            }

            //console.log(item, product_special_bool);
            setCart([...tempCart, [item, 1, product_id, product_special_bool]]) //Add cart + new item
        }
    }

    const removeItem = (itemDel) => { //Remove an item (name of an item) from the cart
        itemDel[1] -= 1; 

        const itemCheck = (element) => element[0] === itemDel; //Call back function to check list for matching string

        if (itemDel[1] <= 0) { //if quantity of itemDel is 0 or less
            setCart(cart.filter((item) => itemDel !== item)); //user filter to create new array full of items that True dont match itemDel
        }
        else { //Else itemDel > 0
            const newCart = cart; //get cart mutable
            newCart[cart.findIndex(itemCheck)] = itemDel;

            setCart([...newCart]);
        }
    }

    //Run seperate from previous useEffect so we dont override anything on intial render run
    //Whenever cart changes, set the local storage representation of it to the state representation of it 
    //Responsible for handling Cart price
    useEffect(() => {
        const handlePrice = async () => { //Handle price changes in the cart
            let sum = 0; //sum of price of everything in cart
            let currentCartItem; //current cart item from list of cart stuff
            let produceListInner = await fetchData(); //Get list of products from state PROBLEM HERE
            let produceIndex; //index of the matching produce item

            for (let i = 0; i < cart.length; ++i) { //for every item in cart
                currentCartItem = cart[i]; //get the current cart item

                for (let j = 0; j < produceListInner.length; ++j) { //loop to find matching item

                    if (currentCartItem[0] === produceListInner[j].product_name) {
                        produceIndex = j; //assign produceIndex to correct index
                        break;
                    }
                }
                
                if (produceListInner[produceIndex].special_bool === true) { //If on special, do discount price
                    const product = produceListInner[produceIndex];
                    sum += (Math.round((product.price - (product.price * product.specials.discount).toFixed(2)) * 20) / 20).toFixed(2) * currentCartItem[1];
                }
                else {
                    sum += produceListInner[produceIndex].price * currentCartItem[1]; //Add price * amount to sum
                }
            }
            sum = sum.toFixed(2); //truncate JS imprecision

            setTotalPrice(sum); //set state, it drills down a component and we update.
            setTotalCartPrice(sum); //Set state var for shopping results

            setcartLocal(cart);
        }

        if (cart.length > 0)
            handlePrice(); //Call the above function

        if (cart.length === 0 && totalPrice > 0) { //THIS IS CHECKS TO AVOID INCONSISTENCY IN CART AND PRICE ACROSS STATE
            setTotalPrice(0);
            setTotalCartPrice(0);
            setcartLocal([]);
        }
        
    }, [cart]);

    useEffect(() => { //Seems to work
        const innerFunction = async () => {
            const response = await fetchData();
            setProducts([...response]); //Call the asnychonus function setProducts
        };
        innerFunction(); 

        if (getDay() !== date.getDay()) { //if day doesnt match, change it
            setDay(date.getDay()); //set updated day
            setNewData(); //que up generating new specials, and then setting state var products to new variables
        }

        const cartLocal = getcartLocal(); //get the temp cart from storage
        if (cartLocal) {//if cartLocal is something, ie exists
            setCart(cartLocal); //override state var with data from local
        }
        
    }, []); //useEffect to only run on intial render/load of the component

    return (
        <>
            <div className="flex-container-cart-outer">
                <div className="cart-flex-column-left">
                    <h1>Produce Selection</h1>
                    { //Aim to map every produce object in array to an AddCartForm object
                        products && products.map((product) => (
                            <AddCartForm addItem={addItem} product={product}/>
                        ))
                    }
                </div>
                <div className="cart-flex-column-right">
                    <CartViewForm cart={cart} removeItem={removeItem} setDisplayCredit={setDisplayCredit} totalPrice={totalPrice} displayCreditForm={displayCreditForm}/>
                    {displayCreditForm ? <CreditForm setCartResults={setCartResults} cart={cart}/> : null /*might have to move this?*/}
                </div>
            </div>
        </>
    )
}

export default ShoppingCart;