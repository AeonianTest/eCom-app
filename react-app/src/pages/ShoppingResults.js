//WIP PAGE THAT DISPLAYS THE RESULTS OF A PURCHASE

function ShoppingResults({ cartResults, totalCartPrice }) { //Accept the results of the purchase + price
    //console.log(cartResults);
    let price = totalCartPrice;

    return (
        <div className="shoppingresults-flex">
            <h1>Receipt of Cart Purchase: { totalCartPrice !== null ? <span className="PriceBox">{price}</span> 
            : <span>Error</span>}$</h1>
            {cartResults !== null ? cartResults.map((result) => (
                <div className="shoppingresult-cartresultitem" key={result[0]}>
                    <div className="shoppingresult-cartresultitem-left">
                        <p>Item: {result[0]}</p> 
                        <p>Amount: {result[1]}</p>
                    </div>
                    <div className="shoppingresult-cartresultitem-right">
                        {<img src={ require(`../images/products/browse${result[2]}.jpg`)} alt={result[0]} className="cart-result-img"/>}
                    </div>
                </div>
            )) : <p>Error 404: Page content not found ):</p>}
            {cartResults !== null && <p>Thank your for your Purchase!</p>}
        </div>
    )
}

export default ShoppingResults;