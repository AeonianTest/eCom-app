import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {setcartLocal} from "../data/cartData";
import { CiCreditCard1, CiCalendarDate } from "react-icons/ci";
import { MdNumbers } from "react-icons/md";
import { PiCardholderLight } from "react-icons/pi";

//This component is responsible for the credit card info for the cart + validation

function formatDate() { //Ty JS for no inbuilt date functionality
    const date = new Date(); //date object to use for date methods
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; //Because JS returns from 0 for some reason
    mm = mm < 10 ? "0" + mm : mm; //Fix leading 0s. should work

    return mm + "/" + yyyy;
}

 //Algorithm to validate credit card number
function LuhnAlgorithm(cardNumber) { //take in STRING of 16 chars
    let sum = 0; //Sum of all values
    let secondValue = false; //when at second value in number

    //Starting from Right digit, double every second
    for (let i = cardNumber.length - 1; i >= 0 ; --i) {
        let doubled = parseInt(cardNumber.charAt(i));

        if (secondValue) {//If we at the secondValue
            doubled *= 2; //double it

            if (doubled > 9) { //if doubled 2 digits
                //console.log(doubled % 10, "digit 1"); //get right digit
                //console.log(Math.floor(doubled / 10), "digit 2"); //Hack to get left digit using division and removing frac part
                sum += (doubled % 10); //Add the 2 digits combined to sum
                sum += Math.floor(doubled / 10);
            }
            else { //Else its <= 9
                sum += doubled; //add the doubled number thats less than 10
            }
        }
        else { //else not at second value
            sum += doubled; //add to sum without actually doubling
        }
        //console.log(sum, "sum");
        
        secondValue = !secondValue; //reverse polarity
    }
    //console.log(sum);

    return (sum % 10) === 0  ? true : false; //return true if value divisble by 10, else dont
}

function dateCheck(EXPdate) { //use this for checking current year date for stuff. Flexible for whatever needed
    const currentDate = formatDate(); //get date
    const yyyy = parseInt(currentDate.slice(-4)); //get last 4 chars (the year) as int. This is the current year
    const mm = parseInt(currentDate.substring(0, 2)); //get mm in int form. This is the current month

    // console.log("EXPdate is", EXPdate);
    // console.log("yyyy is", yyyy);
    // console.log("mm is", mm);

    if (yyyy <= parseInt(EXPdate.slice(-4)) && mm <= parseInt(EXPdate.substring(0, 2))) { //if good year, and current real month <= given month
        //console.log("correct month");
        return true; //return true, real month
    }
    else {
        //console.log("bad month");
        return false;
    }
}

/*
    REWORK ERROR FORM IF TIME (MAKE SURE TESTS ADJUST)
*/

function CreditForm({ setCartResults, cart }) {
    const [ errorMessage, setErrorMessage ] = useState([]); //error message is an array of strings
    const [ errorBool, setErrorBool] = useState(false);
    const currentDate = formatDate(); //Get date as string
    const navigate = useNavigate(); //get navigate function

    const date = new Date(); //date object
    let month = date.getMonth() + 1;

    const handleSubmit = (event) => { //handle submission of form
        event.preventDefault(); //stop default get request so we can use JS
        //console.log("SUBMITTED"); //Testing 
        setErrorMessage([]); //Wipe error message for new

        const EXPdate = event.target.elements.Expiration.value; //get values
        const CVC = event.target.elements.CVC.value;
        const cardNumber = event.target.elements.CardNum.value.replace(/\s/g, ""); //parse Whitespace
        //console.log(cardNumber, CVC, EXPdate);

        // dateCheck(EXPdate); //testing this so far
        // console.log("dateCheck is", dateCheck(EXPdate))

        if (LuhnAlgorithm(cardNumber) && cardNumber !== "0000000000000000" && dateCheck(EXPdate)) {  //if valid credit card and date
            //console.log("Good form")

            setErrorMessage([]); //set error Message empty
            setErrorBool(false); //set error to false

            setCartResults(cart); //set that state in app to cart
            setcartLocal([]); //Set local storage to default
            navigate("/shoppingresults"); //navigate to result screen upon conclusion
        }
        else { //else its bad form, error
            if (!dateCheck(EXPdate)) { //IF bad date
                //console.log("Bad date")

                setErrorMessage(errorMes => [...errorMes, "Please enter a current date"]); //THanks react docs, this is how your meant to do this
            }
            if (!LuhnAlgorithm(cardNumber) || cardNumber === "0000000000000000") { //IF bad cardNumber
                //console.log("Bad cardNumber")
                
                setErrorMessage(errorMes => [...errorMes, "Please enter a valid Card number"]);
                setErrorMessage(errorMes => [...errorMes, "eg) 4916 2198 1264 9839"]);
            }
            
            //setErrorMessage("Please enter a valid Credit Card number"); //8926 4198 2234 9869
            setErrorBool(true);
        }
    }

    useEffect(() => {
        console.log("useEffect errors", errorMessage);
        //console.log("errorBool", errorBool)
    }, [errorMessage]);

    return (
        <>
        <div className="CreditForm-Container-flex">
            <form className="Credit-Form-Box" onSubmit={handleSubmit} data-testid="Credit-Form">
                <div className="CF-Top">
                    <h1><CiCreditCard1 /> Billing Information</h1>
                </div>
                <div className="CF-input-field">
                    <label htmlFor="Expiration" className="CF-input-label">Expiration Date <CiCalendarDate /></label>
                    <input name="Expiration" id="Expiration" type="text" pattern="[0-9]{2}/[0-9]{4}" required className="CF-input-element"
                    defaultValue={currentDate}></input>
                </div>
                <div className="CF-input-field">
                    <label htmlFor="CVC" className="CF-input-label">CVC <MdNumbers /></label>
                    <input name="CVC" id="CVC" type="text" pattern="[0-9]{3}" required className="CF-input-element"
                    defaultValue="000"></input>
                </div>
                <div className="CF-input-field">
                    <label htmlFor="CardNum" className="CF-input-label">Card Number <PiCardholderLight /></label>
                    <input name="CardNum" id="CardNum" type="text" pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}" required className="CF-input-element"
                    defaultValue="0000 0000 0000 0000"></input>
                </div>
                <button role="button" className="CF-confirm-submit" type="submit" value="submit">Confirm Payment Details</button>
                { errorBool === true ? 
                    <ul>
                        {errorMessage.map((errorMes, index) => (
                            <li key={index}>{errorMes}</li>
                        ))}
                    </ul>
                : null}
            </form>
        </div>
        </>
    )
}

export default CreditForm; 