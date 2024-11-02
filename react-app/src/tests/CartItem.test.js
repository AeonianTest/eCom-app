import { render, screen, fireEvent, getByText } from "@testing-library/react";
import CartItem from "../fragments/CartItem";

/*
    Located within this file are unit test(s) related towards verifying functionality of the Shopping Cart
*/

/*
    This is a basic boiler plate test to verify that the CartItem component is at all functional
    We render the component with mock data and functions to see if it can be visualised
*/
test("Render Cart Item", () => { 
    const item = [["Apples",3,1,false]];
    const mockremoveItem = jest.fn(); //Jest mock function

    const utils = render(<CartItem item={item} removeItem={mockremoveItem}/>);
    const container = utils.container;

    expect(container).toBeInTheDocument();
})

/*
    This test is aimed torward testing that the component can take in dynamic data and correctly display its contents
    We pass in data for the component, and test that based off it it can display the correct data.
    By evaluating data we can test for correct data/functions in the component
*/

test("CartItem Displays correct content", () => {
    const item = [["Apples",3,1,true]];
    const mockremoveItem = jest.fn(); //Jest mock function

    const utils = render(<CartItem item={item} removeItem={mockremoveItem}/>);
    const container = utils.container;

    expect(container).toBeVisible(); //Can the user see anything?

    //screen.debug(container);

    //Testing button to see if displayed correctly
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
});

/*
    This test aimes to test that upon user iteraction it passes the correct data, and executes properly
    We verify that after button click we correctly pass the data, by testing that we call the mocked function with item
*/

test("Button submits the correct data", () => {
    const item = [["Apples",3,1,true]];
    const mockremoveItem = jest.fn(); //Jest mock function

    const utils = render(<CartItem item={item} removeItem={mockremoveItem}/>);
    const container = utils.container;

    //Get the remove from cart button
    const removeItemButton = screen.getByRole("button", { name: "Remove" });

    //Simulate clicking the button once, and expect that it was called with the correct data
    fireEvent.click(removeItemButton);
    expect(mockremoveItem).toHaveBeenCalledWith(item);
});