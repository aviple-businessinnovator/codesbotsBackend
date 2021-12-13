const express = require("express");
const Course = require("../model/courseModel");
const jwt = require("jsonwebtoken");
const route = express.Router();


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
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});


// GET Course By Id
route.get("/course/:id?", async (req, res) => {
    try {
      // console.log(`"1" ${req.params.id}`)
      if (req.params.id) {
        // console.log(`"1" ${req.query.id}`)
        const courseDetail = await Course.findById(req.params.id);
        res.status(200).send(courseDetail);
      } else{
        const courses = await Course.find({});
        res.status(200).send(courses);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = route;