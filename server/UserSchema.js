const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  history: {
    type: Schema.Types.ObjectId,
    ref: "History",
  },
  status: {
    type: String,
    enum: ["online", "offline", "playing", "finding"],
    default: "finding",
  },
});

module.exports = mongoose.model("User", User);
