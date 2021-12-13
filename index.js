//////////////////////////DEPENDENCIES//////////////////////
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cookies = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require("./database/connection");

///////////////////////PORT///////////////////
const PORT = process.env.PORT || 3000;
//////////////////////MONGOOSE CONNECTION///////////////////
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cookies());
app.use(cors());
// app.set("view engine","ejs");

// ecommerce 
const prodRoute = require("./ecomBackend/src/api/productRoute");
const addressRoute = require("./ecomBackend/src/api/addressRoute");
const paymentRoute = require("./ecomBackend/src/api/paymentRoute");
app.use(prodRoute);
app.use(addressRoute);
app.use(paymentRoute);

// login and signup
const userValidateRoute = require("./userBackend/src/api/user");
app.use(userValidateRoute);

// courses
const coursesRoute = require("./userBackend/src/api/courseApi");
app.use(coursesRoute);


  // All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });



app.listen(PORT,function(){
    console.log(`Server Started at PORT ${PORT}`);
});
