const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const History = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  history: [
    {
      duration: { type: String },
      result: { type: String, enum: ["lose", "win"] },
    },
  ],
});
module.exports = mongoose.model("History", History);
