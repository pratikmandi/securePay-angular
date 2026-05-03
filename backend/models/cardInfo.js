const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  cardHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  expireDate: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},
{ timestamps: true },
);

module.exports = mongoose.model("Card", CardSchema);
