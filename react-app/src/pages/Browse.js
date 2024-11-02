import React, { useState, useEffect } from "react";
import ProductServices from "../services/ProductServices"
import { initDay, getDay, setDay,  genDaySpecials } from "../data/browseData"

// import {browse1} from "../images/products" //Figuring out how to import

/*
    Responsible for displaying Standard and Special products
*/

function Browse() { //all funcs called run on every component mounting (ie when this component loaded)
    const [products, setProducts] = useState([]); //Set products intially to empty array

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

    const date = new Date(); //date object to use  
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // dates lined up to js inbuilt getDay function
    initDay(); //Put day in localStorage if not already there

    useEffect(() => {
        const innerFunction = async () => {
            const response = await fetchData();
            setProducts([...response]); //Call the asnychonus function setProducts
        };

        innerFunction();

        if (getDay() !== date.getDay()) { //if day doesnt match, change it
            // console.log(getDay(), " dont match ", date.getDay()); 
            setDay(date.getDay()); //set updated day
            setNewData(); //que up generating new specials, and then setting state var products to new variables
        }

        //Make sure this is in here, because useEffect here runs once after re-rendering
    }, []);

    return (
        <div className="browse-body">
            <div id="browse-title">
                <h1>Standard and Special products</h1>
            </div>
            <div id="flex-container-browse-outer">
                <div className="browse-box-column-left">
                    <h1>Todays Specials!</h1>
                    <p>Offers limited to {days[date.getDay()]} only.</p>
                    {  //dynamically map array of items to screen
                        products && products
                        .filter(product => product.special_bool)
                        .map((product) => (
                        <div className="week-specials" key={product.product_id}>
                            <u>{product.product_name}</u>
                            <p>{product.specials.specials_info}</p>
                        </div>
                        )
                    )}
                </div> 
                <div className="browse-box-column-right">
                    <h1>Browse Products</h1>
                    <p>Purchase today!</p>
                    { //dynamically map array of products to screen.
                        products && products.map((product) => (
                        <div className="products-list-item" key={product.product_id}>
                            <div className="productslistitem-left">
                                {<img src={ require(`../images/products/browse${product.product_id}.jpg`)} alt={product.product_name} className="product-img"/>}
                            </div>
                            <div className="productslistitem-right">
                                <p>{product.product_name}: {product.special_bool && <span> On Special today!</span>}</p>
                                <p>{product.info}</p>
                            </div>
                        </div>
                        )) 
                    }
                </div>
            </div>
        </div>
    );
}

export default Browse;
