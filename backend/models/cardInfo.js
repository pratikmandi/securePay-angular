const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  balance: {
    type: Number,
  },
  cardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expireDate: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Card", CardSchema);
