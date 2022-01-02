const express = require("express");
const auth = require("../auth/auth");
const Address = require("../models/address");
const route = express.Router();

route.post("/address", auth, async (req, res) => {
  try {
    const { full_name, line_1, line_2, city, state, pincode, phone_no } =
      req.body;
    console.log(full_name);
    const address = new Address({
      full_name: full_name,
      line_1: line_1,
      line_2: line_2,
      city: city,
      state: state,
      pincode: pincode,
      phone_no: phone_no,
      userId: req.user._id,
    });
    await address.save();
    res.status(201).json({
      success: true,
      message: "Address saved successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "An unknown error occured",
      error: err,
    });
  }
});
module.exports = route;
