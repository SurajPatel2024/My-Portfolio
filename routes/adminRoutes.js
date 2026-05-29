const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Message = require("../models/Message");

router.get("/admin", async (req, res) => {
  const projects = await Project.find();
  const messages = await Message.find().sort({ createdAt: -1 });

  res.render("admin", {
    projects,
    messages
  });
});

router.post("/admin/project", async (req, res) => {
  await Project.create(req.body);
  res.redirect("/admin");
});

router.delete("/admin/project/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

module.exports = router;