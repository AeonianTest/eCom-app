//The following snippet is based on Week 4 Ex. 4 Course Material COSC2410 semester 1, 2024.

//This code takes the cart from ShoppingCart.js to dynmically render them using the CartItem component

import CartItem from "./CartItem";

function CartViewForm({ cart, removeItem, setDisplayCredit, totalPrice, displayCreditForm}) { //Display the cart items in a form like view
    //We'll fix key later by using object idk

    let displayPurchaseButton = (cart.length > 0) ? true : false; //get true false for displaying button if cart > 0
    //console.log(displayPurchaseButton, "displayPurchaseButton");

    const submitPurchase = (event) => { //Upon button press
        console.log("submit purchase");
        setDisplayCredit(displayCreditForm => !displayCreditForm); //set state variable level above true, so we can view form
    }

    return (
        <div className="Outer-CartViewForm-Flex">
            <h1>View the Cart</h1>
            <div className="ViewForm-flex">
                <ul>
                    {cart.map((cartItem) => (
                        <li key={cartItem[0]}>
                            <CartItem key={cartItem[0]} item={cartItem} removeItem={removeItem}/>
                        </li>
                    ))}
                </ul>
            </div>
            <p>
                Price of products:
                <span className="PriceBox"> ${totalPrice} </span>
            </p>
            {(displayPurchaseButton !== false) ? <button className="FinaliseButton" onClick={submitPurchase}>Finalise purchase</button> : null}
        </div>
    );
};

export default CartViewForm;