const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Testimonial = require("../models/Testimonial");

router.get("/", async (req, res) => {

  const projects = await Project.find();

  const testimonials = await Testimonial.find();

  res.render("index", {
    projects,
    testimonials
  });

});

module.exports = router;