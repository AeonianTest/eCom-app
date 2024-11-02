import React from "react";

function Footer() { //Footer displayed at bottom of screen
    const year = new Date().getFullYear(); //Get current year

    return(
        <footer className="footer">
            <p>e-commerce mock app</p>
            <p>eCom: Fictional business co. All rights reserved. © {year}.</p>
        </footer>
    );
}

export default Footer;