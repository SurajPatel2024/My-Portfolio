require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const username = "Suraj";
    const password = "Suraj@2122";

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.deleteMany({});

    await Admin.create({
      username,
      password: hashedPassword
    });

    console.log("New Admin Created");
    console.log("Username:", username);
    console.log("Password:", password);

    process.exit();

  })
  .catch(err => console.log(err));

  // command node createAdmin.js