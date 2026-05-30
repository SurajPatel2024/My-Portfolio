require("dotenv").config(); // ✅ 'R' को छोटा कर दिया

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const path = require("path"); // ✅ 'path' मॉड्यूल इम्पोर्ट किया

const app = express();

// Models
const Admin = require("./models/Admin");
const Project = require("./models/Project");
const Testimonial = require("./models/Testimonial");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

// View Engine & Views Path Config
// View Engine
const path = require("path"); // अगर 'path' ऊपर इम्पोर्ट नहीं है तो
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public"))); // ✅ स्टैतिक फाइल्स के लिए पाथ सेट किया

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Admin Middleware
function isAdmin(req, res, next) {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect("/login");
  }
}

// HOME PAGE
app.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    const testimonials = await Testimonial.find().sort({ _id: -1 });
    res.render("index", {
      projects,
      testimonials
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.send("Admin Not Found");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.send("Wrong Password");
    }
    req.session.adminId = admin._id;
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Login Error");
  }
});

// DASHBOARD
app.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    const testimonials = await Testimonial.find().sort({ _id: -1 });
    res.render("dashboard", {
      projects,
      testimonials
    });
  } catch (err) {
    console.log(err);
    res.send("Dashboard Error");
  }
});

// ADD PROJECT PAGE
app.get("/add-project", isAdmin, (req, res) => {
  res.render("add-project");
});

// ADD PROJECT
app.post("/add-project", isAdmin, async (req, res) => {
  try {
    await Project.create({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      liveLink: req.body.liveLink,
      category: req.body.category
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Project Add Error");
  }
});

// DELETE PROJECT
app.delete("/delete-project/:id", isAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Delete Error");
  }
});

// ADD TESTIMONIAL PAGE
app.get("/add-testimonial", isAdmin, (req, res) => {
  res.render("add-testimonial");
});

// ADD TESTIMONIAL
app.post("/add-testimonial", isAdmin, async (req, res) => {
  try {
    await Testimonial.create({
      clientName: req.body.clientName,
      message: req.body.message,
      rating: req.body.rating,
      photo: req.body.photo
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Testimonial Error");
  }
});

// DELETE TESTIMONIAL
app.delete("/delete-testimonial/:id", isAdmin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Delete Error");
  }
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});