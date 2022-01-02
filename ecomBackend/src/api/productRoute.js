const express = require("express");
const Product = require("../models/productModel");
const Order = require("../models/orders");
const Users = require("../../../userBackend/src/model/userModel");
const auth = require("../auth/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const route = express.Router();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


// GET Products By Id
route.get("/products/:id?", async (req, res) => {
  try {
    if (!req.params.id) {
      if (isValidObjectId(req.params.id)) {
        const products = await Product.find({}).lean().exec()
        res.status(200).json({
          success: true,
          products: products
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid object id in the request" 
        });
      }
    } else if (req.params.id) {
      const product = await Product.findById(req.params.id).lean().exec()
      res.status(200).json({
        success: true,
        product: product
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An unknown error occured"
      error: error
    });
  }
});
//add to cart
route.post("/addtocart/:productid/:quantity", auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.productid);
    const cart = await new Order({
      owner: req.user._id,
      product: prod._id,
      quantity: req.params.quantity,
    });
    await cart.save().exec()
    res.status(201).send(cart);
  } catch (error) {
    res.status(400).send(error);
  }
});
// get cart
route.get("/cart", auth, async (req, res) => {
  try { 
    const token = req.header("Authorization").replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    const prod = await Order.find({owner:verifiedToken._id}).populate("product").exec()
    // console.log(prod)
    res.status(200).send(prod);
  } catch (error) {
    res.status(400).send(error);
  }
});
//remove product from cart
route.delete("/deletecart/:orderid", auth, async (req, res) => {
  try {
    if (isValidObjectId(req.params.id)) {
      const prod = await Order.findByIdAndDelete(req.params.orderid);
      res.status(200).json({
        success: true,
        message: "Product deleted from cart" 
      });
    } else {
       res.status(401).json({
        success: false,
        message: "Invalid object id in the request" 
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//update quantity
route.put("/updatecart/:orderid/:quantity", auth, async (req, res) => {
  try {
    if (isValidObjectId(req.params.id)) {
       const updateorder = await Order.findByIdAndUpdate(req.params.orderid, {
          quantity: req.params.quantity,
      });
      res.status(201).json({
        success: true,
        message: "Order Updated" 
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid object id in the request" 
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//test email route
//should work fine on production. We just need some auth keys from google console and oauth playground.
route.post("/send-mail",async (req,res) => {
  const { username,email,timings,course_title } = req.body;

  const oauth2Client = new OAuth2(
     process.env.OAUTH_CLIENTID, // ClientID
     process.env.OAUTH_CLIENT_SECRET, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
     );
    oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });
  const accessToken = oauth2Client.getAccessToken()

  const smtpTransport = nodemailer.createTransport({
      port: 465,
        host: "smtp.gmail.com",
        secure: true,
    auth: {
      type: "OAuth2",
      user: "saswatsingh629@gmail.com", 
      //we'll get all these details from google console.
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const mailOptions = {
    from: "officialcodesandbotemailhere@gmail.com",
    to: email,
    subject: "Registration for your course at codesandbot.",
    generateTextFromHTML: true,
    html: `
      <h2>Welcome ${user}</h2>
      <p>A huge greeting from the codesandbot team for registering for a course. We are glad you chose us for your learning journey.</p>
      <h3>Course Details</h3>
      <p>Here are your course details</p>
      <ul>
        <li><strong>Timings: </strong>${timings}</li>
        <li><strong>Course Name: </strong>${course_title}</li>
      </ul>
      Hope you enjoy the course. We'll see you there.
      <br>
      <br>
      <p>Regards</p>
      <p>The CodeSandBot Team</p>
    `
  };
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.status(404).json({
        success: false,
        message: 'There was a problem sending email',
        response: response,
        error: error
      })
    } else {
      res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      response: response,
      error: null
    })
    smtpTransport.close();
    }
  });
})

module.exports = route;
