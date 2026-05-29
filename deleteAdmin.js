require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model("Admin", adminSchema);

async function deleteAdmin() {

  await Admin.deleteMany({});

  console.log("Old Admin Deleted");

  mongoose.connection.close();
}

deleteAdmin();