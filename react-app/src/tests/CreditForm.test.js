import React from "react";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { render, screen, fireEvent, getByText } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import CreditForm from "../fragments/CreditForm";

/*
    Located within this file are unit test(s) related towards verifying functionality of the Shopping Cart
    Practical code is like 18 months old, half of it doesnt work.
*/

function formatDate() { //Imported function that we need
    const date = new Date(); //date object to use for date methods
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; //Because JS returns from 0 for some reason
    mm = mm < 10 ? "0" + mm : mm; //Fix leading 0s. should work

    return mm + "/" + yyyy;
}

/*
    This test is a bolier test basic rendering. Just evaluating that the components functions at all
    More dynamic tests below
*/

test("Render Credit Form", () => {
    const cart = [[["Apples",3,1,false],["Hand Trowel",2,2,false],["Coffee beans",1,5,false]]]; //Sample cart to send to the object
    const mocksetCartResults = jest.fn(); //mock fnc

    const utils = render(<Router><CreditForm setCartResults={mocksetCartResults} cart={cart}/></Router>);
        
    const container = utils.container;

    expect(container).toBeInTheDocument();
});


/*
    This test aims to validate that the CreditForm renders with its correct HTML attributes
    We test to see that the form input fields are as expected with the correct regex validation patterns and other related attributes
    After passing in the correct functions, we verify that all the parts in the component are correct, and contain the correct attributes
*/
test("Displays correct content CreditForm", () => {
    const cart = [[["Apples",3,1,false],["Hand Trowel",2,2,false],["Coffee beans",1,5,false]]]; //Sample cart to send to the object
    const mocksetCartResults = jest.fn(); //mock fnc

    const utils = render(<Router><CreditForm setCartResults={mocksetCartResults} cart={cart}/></Router>);
    const container = utils.container;

    expect(container).toBeVisible(); //Can the user see anything?
    expect(screen.getByTestId('Credit-Form')).toBeInTheDocument(); //Expecting the entire form

    expect(screen.getByLabelText("Expiration Date")).toBeInTheDocument(); //Expecting the label text to exist
    expect(screen.getByLabelText("CVC")).toBeInTheDocument();
    expect(screen.getByLabelText("Card Number")).toBeInTheDocument();

    const expDateElement = screen.getByLabelText("Expiration Date"); //Testing attributes expriry date field
    expect(expDateElement).toHaveAttribute("pattern", "[0-9]{2}/[0-9]{4}"); //matching the patterns (NOTE THE TESTS ARE WEIRD ON ESCAPE CHARs)
    expect(expDateElement).toHaveAttribute("type", "text");

    const cvcElement = screen.getByLabelText("CVC"); //Testing attributes of cvc field
    expect(cvcElement).toHaveAttribute("type", "text");
    expect(cvcElement).toHaveAttribute("pattern", "[0-9]{3}");

    const currDate = formatDate(); //Testing that the date is correctly displayed
    expect(screen.getByDisplayValue(currDate)).toBeInTheDocument();

    expect(screen.getByRole("button")).toBeInTheDocument(); //Look for the button in the form
});


/*
    This Unit test aims to validate that when incorrect data is inputed into the form that we correctly reject the data with the correct error messages
    We input incorrect Date and Card number, before submitting the form and testing for error messages
    We access the form to input incorrect data, and then simulate submission to test for the correct error responses from the CreditForm
*/
test("CreditForm Error handling", () => {
    const cart = [[["Apples",3,1,false],["Hand Trowel",2,2,false],["Coffee beans",1,5,false]]]; //Sample cart to send to the object
    const mocksetCartResults = jest.fn(); //mock fnc

    const utils = render(<Router><CreditForm setCartResults={mocksetCartResults} cart={cart}/></Router>);
    const container = utils.container;

    const paymentSubmitButton = screen.getByRole("button"); //Get the button

    const dateField = screen.getByLabelText("Expiration Date"); //get the input/label field of the date
    const cardNumberField = screen.getByLabelText("Card Number"); //get the input/label field of the card number

    // console.log(cardNumberField);
    // screen.debug(dateField);

    fireEvent.change(cardNumberField, { target: { value: "1234 5678 9012 3456" } }); //Enter bad card number
    expect(cardNumberField.value).toBe("1234 5678 9012 3456"); // validate that the field has been changed

    fireEvent.change(dateField, { target: { value: "01/2024"} }); //Enter bad month
    expect(dateField.value).toBe("01/2024");

    fireEvent.click(paymentSubmitButton); //This simulates entering/submitting the form

    expect(screen.getByText("Please enter a valid Card number")).toBeInTheDocument(); //Test for error messages
    expect(screen.getByText("Please enter a current date")).toBeInTheDocument();
}); 



/*
    This Test aims to verify success handling on the form.
    We enter the correct data, and expect that when the form is submitted we are navigated off page to the correct destination
    By passing in correct form to the input areas, we test to see if the navigate is correctly called to move off page, as expected behaviour
*/

//Mocked function code from StackOverflow user exaucase, https://stackoverflow.com/questions/66284286/react-jest-mock-usenavigate 
const mockedNav = jest.fn(); //Create mocked nav jest function
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNav, //MOCKING THE NAVIGATE ROUTER TOOL
}));

test("CreditForm Success handling", () => {
    const cart = [[["Apples",3,1,false],["Hand Trowel",2,2,false],["Coffee beans",1,5,false]]]; //Sample cart to send to the object
    const mocksetCartResults = jest.fn(); //mock fnc

    const utils = render(<Router><CreditForm setCartResults={mocksetCartResults} cart={cart}/></Router>);
    const container = utils.container;

    const paymentSubmitButton = screen.getByRole("button"); //Get the button

    const dateField = screen.getByLabelText("Expiration Date"); //get the input/label field of the date
    const cardNumberField = screen.getByLabelText("Card Number"); //get the input/label field of the card number

    fireEvent.change(cardNumberField, { target: { value: "4916 2198 1264 9839" } }); //Enter good card number
    expect(cardNumberField.value).toBe("4916 2198 1264 9839"); // validate that the field has been changed

    fireEvent.change(dateField, { target: { value: "02/2026"} }); //Enter good month
    expect(dateField.value).toBe("02/2026");

    fireEvent.click(paymentSubmitButton); //This simulates entering/submitting the form
    expect(mockedNav).toHaveBeenCalledWith("/shoppingresults"); //Expect that we have called the navigate function to move in browser
});