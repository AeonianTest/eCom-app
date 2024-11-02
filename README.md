# Simulation E-Commerce Web Application & Backend Stack: 

*Preface:*
In this document is code developed jointly in collaboration with rmit students s4006011 and s4008809, sanitized for sake of publishing publiclly

**GitHub-URL**
https://github.com/AeonianTest/eCom-app.git 

## eCom-app code notes

Located in this repository is the source code for a mock e-commerce style Frontend and Backend application, handling both a visitible client for browsers to access and NodeJS based server to handle the backend iteractions with our SQL database. Please note that the server and react app are each their own seperate nodejs projects, and as such have their own seperate dependencies to be installed seperately in both react-app and react-server.

In order to host the website on your local browser, run the following commands in your local terminal.

    cd react-app
    npm install 
    npm start

This by default will navigate to the directory react-app, install node packages and then start hosting the website on your local port 3000, which you can access to interact with the website. Static assets are stored in the public directory. The src directory contains the dynamic React logic neccecary for the website functionality. Within the src directory is the core App and Index js files to the React program, and five directorys for further components:

- /data which contains ancillary functions needed for handling frontend data
- /fragments, containing page specific sub components neccecary to implement page functionaility.
- /images which contains several public domain images to display on the website
- /pages contains all the pages that can navigated to and displayed as the main content on the screen
- /services which defines the methods for interacting with the backend server
- /test, which contains all the unit test for components to guarantee system functionality

Additionally the server must be ran on a seperate terminal/shell session from the react-app simultaneously. From the git root run the following commands in your local terminal.

    cd react-server
    npm install
    npm start

This runs the server with Node, allowing for communication between client browser and our databse. Within the server we have the definitions of our database table models, and the definitions of our database API for our frontend to interact with.

Finally within react-app/src/tests are our comprehensive Unit Tests. In order to run the various Unit Tests, execute the following to enter the react-app directory and run the test suites

    cd react-app
    npm run test
    a

This will run the Unit Tests in the terminal. Further details are outlined within in the directory and in accompanying comments by the tests.

## Notes/Troubleshooting problems

* Within react-server/src/database/ you should place a config.js 
    - Include within the module.exports = {};
        - HOST
        - USER
        - PASSWORD
        - DB
        - DIALECT
* If upon accessing the website hosted nothing is rendered and only a white page is visibile, try deleting localstorage for the given port and then reloading. There may be a conflict in port resources causing problems.
* Please ensure sure you have started the running of both the app and server using node on seperate terminal sessions to access the full capabilities of the website and to avoid errors.
* Located within react-app/src/images are images sourced from open domain and royalty free locations

## Authors

- s4006011
- s4008809

