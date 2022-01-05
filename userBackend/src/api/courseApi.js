const express = require("express");
const mongoose = require("mongoose");
const Course = require("../model/courseModel");
const route = express.Router();
const { isValidObjectId } = require("mongoose")


// add new course

route.post("/add-course", async (req, res) => {
  try {
    // console.log(`hh  ${req.body.heading.mainTitle}`);
    const course = await new Course({
    courseId:req.body.courseId,
    courseName: req.body.courseName,
    courseRating  : req.body.courseRating,
    imageLink :req.body.imageLink,
    videoLink :req.body.videoLink ,
    heading: req.body.heading
    });
    await course.save().exec()
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});


// GET Course By Id
route.get("/course/:id?", async (req, res) => {
    try {
      if (req.params.id) {
        if (isValidObjectId(req.params.id)) {
          const courseDetail = await Course.findById(req.params.id).lean().exec()
          res.status(200).json({
              success: true,
              courseDetail: courseDetail
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Invalid object id in the request"
          })
        }
      } else{
        const courses = await Course.find({}).lean().exec()
        res.status(200).json({
          success: true,
          courses: courses
        });
      }
    } catch (error) {
      res.status(400).json({
        success: "false",
        message: "Something went wrong",
        error: error
      });
    }
  });

module.exports = route;