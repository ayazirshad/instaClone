const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: { value: true, message: "username not available" },
  },
  email: {
    type: String,
    required: true,
    unique: { value: true, message: "Email already registered" },
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    type: String, // Url or reference
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid url for profile picture");
      }
    },
  },
  name: String,
  bio: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
