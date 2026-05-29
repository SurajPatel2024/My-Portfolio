const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  clientName: String,
  message: String,
  rating: Number,
  photo: String
});

module.exports = mongoose.model("Testimonial", testimonialSchema);