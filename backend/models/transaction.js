const mongoose = require("mongoose");

const TRANSACTION_TYPES = ["transfer", "bill", "card_transfer", "balance_credit"];

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  /** Primary card for this ledger line (debited or credited). */
  cardNumber: {
    type: String,
    required: true,
  },

  /** Counterparty card for internal transfers (optional otherwise). */
  toCardNumber: {
    type: String,
    default: "",
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  description: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    enum: TRANSACTION_TYPES,
    default: "transfer",
  },

  /** debit = funds out of primary card; credit = funds into primary card */
  direction: {
    type: String,
    enum: ["debit", "credit"],
    default: "debit",
  },

  payee: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
