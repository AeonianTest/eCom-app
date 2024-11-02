//Used to handle items generally on screen

//The following snippet is based on Week 4 Ex. 4 Course Material COSC2410 semester 1, 2024.

import React from 'react';

function CartItem({ item, removeItem }) { //name (?) and method. Might use Amount
    return (
        <div className="ViewForm-item">
            <div className="ViewForm-item-content">
                <p>{item[0]}: x{item[1]} </p>
                {item[3] === true ? <b>Special Item</b> : null}
            </div>
            <button className="ViewForm-item-button" onClick={() => removeItem(item)}> Remove</button>
        </div>
    );
}

export default CartItem;