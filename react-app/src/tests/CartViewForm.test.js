import React from "react";
import { render, screen, fireEvent, getByText } from "@testing-library/react";
import CartViewForm from "../fragments/CartViewForm";

/*
    Located within this file are unit test(s) related towards verifying functionality of the Shopping Cart
*/

/*
    This is just a boiler plate test to verify its possible to render this at all
    We pass in mocked data and functions, and test if the component can be substantiated
*/

test("Render CartViewForm", () => {
    const cart = [];
    const mockremoveItem = jest.fn(); //mock fnc
    const mocksetDisplayCredit = jest.fn(); //mock fnc
    const totalPrice = 48.35;

    const utils = render(<CartViewForm cart={cart} removeItem={mockremoveItem} setDisplayCredit={mocksetDisplayCredit} totalPrice={totalPrice}/>);
    const container = utils.container;

    expect(container).toBeInTheDocument();
    //screen.debug();
});

/* 
    In this Unit Test we verify the functionality of the conditional rendering of button based off data passed to it
    We pass in an empty cart to verify that the conditional rendering functions as expected
    First by passing in an empty cart, we verify that the user cannot access the purchase button
    Then by passing in an cart with items, we verify that the user can then access the purchase option
*/

test("Conditional button rendering CartViewForm", () => {
    const cart = [];
    const mockremoveItem = jest.fn(); //mock fnc
    const mocksetDisplayCredit = jest.fn(); //mock fnc
    const totalPrice = 0;

    render(<CartViewForm cart={cart} removeItem={mockremoveItem} setDisplayCredit={mocksetDisplayCredit} totalPrice={totalPrice}/>);

    //Test for non-existence of the finalise purchase button
    expect(screen.queryByRole("button", { name: "Finalise purchase" })).toBeNull(); 

    //Push item to cart, then rerender it
    cart.push(["Apples",3,1,false]);
    render(<CartViewForm cart={cart} removeItem={mockremoveItem} setDisplayCredit={mocksetDisplayCredit} totalPrice={totalPrice}/>);

    //Test that now cart cart length > 0, is the button accesible in the DOM
    expect(screen.queryByRole("button", { name: "Finalise purchase" })).toBeInTheDocument();
});

/*
    This test aims to test to reponsitivity of the Cart elements to change.
    We pass different sets of carts to the Component, and verify that it dynamically maps the correct amount of list elements onto the screen.
    By counting the number of <li> elements with different amounts of items in cart, we can verify that the dynamic rendering of the component funcitons
*/
test("Dynamic rendering of cart data", () => {
    let cart = [];
    const mockremoveItem = jest.fn(); //mock fnc
    const mocksetDisplayCredit = jest.fn(); //mock fnc
    const totalPrice = 0;

    render(<CartViewForm cart={cart} removeItem={mockremoveItem} setDisplayCredit={mocksetDisplayCredit} totalPrice={totalPrice}/>);

    //get all the list elements, and verify that the correct amount is displayed, ie none
    expect(screen.queryByRole("listitem")).toBeNull();  

    //Change the cart and re-render the component
    cart = [["Apples",3,1,false],["Hand Trowel",2,2,false],["Banana",2,3,false]];
    render(<CartViewForm cart={cart} removeItem={mockremoveItem} setDisplayCredit={mocksetDisplayCredit} totalPrice={totalPrice}/>);

    //get all the list elements, and verify that the correct amount is displayed (ie cart.length which is 3)
    let listElements = screen.getAllByRole('listitem'); 
    expect(listElements.length).toBe(cart.length);

    // screen.debug(listElements);
    // console.log(listElements.length)
});
