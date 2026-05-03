const mongoose = require("mongoose");
const Card = require("../models/cardInfo");
const Transaction = require("../models/transaction");
const {
  normalizeCardNumber,
  validateCardNumberDigits,
  validateExpiry,
} = require("../utils/cardValidation");

const addCard = async (req, res) => {
  try {
    let { cardHolderName, cardNumber, balance, expireDate } = req.body;

    cardNumber = normalizeCardNumber(cardNumber);
    const cardCheck = validateCardNumberDigits(cardNumber);
    if (!cardCheck.ok) {
      return res.status(400).json({ message: cardCheck.message });
    }

    const expCheck = validateExpiry(expireDate);
    if (!expCheck.ok) {
      return res.status(400).json({ message: expCheck.message });
    }

    const bal = Number(balance);
    if (Number.isNaN(bal) || bal < 0) {
      return res.status(400).json({ message: "Balance must be a non-negative number." });
    }

    const card = new Card({
      cardHolderName: String(cardHolderName || "").trim(),
      cardNumber,
      balance: bal,
      expireDate: String(expireDate || "").trim(),
      userId: req._id,
    });

    const cardDetails = await card.save();
    return res.status(201).json(cardDetails);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This card number is already registered." });
    }
    console.error(err);
    return res.status(500).json({ message: "Could not add card." });
  }
};

const getCards = async (req, res) => {
  const cards = await Card.find({ userId: req._id }).sort({ createdAt: -1 }).lean();

  res.json(cards);
};

/** PATCH body: { amount } — adds `amount` to the card's current balance (top-up). */
const updateCardBalance = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid card id." });
    }
    const add = Number(req.body.amount);

    if (Number.isNaN(add) || add <= 0) {
      return res.status(400).json({ message: "Enter an amount greater than zero to add." });
    }

    const card = await Card.findOne({ _id: cardId, userId: req._id });
    if (!card) {
      return res.status(404).json({ message: "Card not found." });
    }

    card.balance = Number(card.balance) + add;
    await card.save();

    await new Transaction({
      userId: req._id,
      cardNumber: card.cardNumber,
      amount: add,
      description: "Balance credit",
      type: "balance_credit",
      direction: "credit",
    }).save();

    return res.json({ message: "Funds added.", balance: card.balance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not add funds." });
  }
};

const makeTransaction = async (req, res) => {
  try {
    const { cardNumber: rawNumber, amount, description, type = "transfer", payee } =
      req.body;

    const cardNumber = normalizeCardNumber(rawNumber);
    const amt = Number(amount);

    if (!cardNumber) {
      return res.status(400).json({ message: "Card number is required." });
    }
    if (Number.isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    const txType = type === "bill" ? "bill" : "transfer";

    const card = await Card.findOne({ cardNumber, userId: req._id });
    if (!card) {
      return res.status(404).json({ message: "Card not found for this account." });
    }

    const expCheck = validateExpiry(card.expireDate);
    if (!expCheck.ok) {
      return res.status(400).json({ message: "Cannot use an expired card." });
    }

    if (card.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    card.balance -= amt;
    await card.save();

    const transaction = new Transaction({
      userId: req._id,
      cardNumber,
      amount: amt,
      description: String(description || "").trim(),
      type: txType,
      direction: "debit",
      payee: txType === "bill" ? String(payee || "").trim() : "",
    });

    await transaction.save();

    res.json({
      message: "Transaction successful",
      balance: card.balance,
      transaction,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Transaction failed." });
  }
};

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    userId: req._id,
  })
    .sort({ date: -1 })
    .lean();

  res.json(transactions);
};

const transferBetweenCards = async (req, res) => {
  const fromNorm = normalizeCardNumber(req.body.fromCardNumber);
  const toNorm = normalizeCardNumber(req.body.toCardNumber);
  const amt = Number(req.body.amount);

  if (!fromNorm || !toNorm) {
    return res.status(400).json({ message: "Both source and destination cards are required." });
  }
  if (fromNorm === toNorm) {
    return res.status(400).json({ message: "Choose two different cards." });
  }
  if (Number.isNaN(amt) || amt <= 0) {
    return res.status(400).json({ message: "Amount must be greater than zero." });
  }

  try {
    const fromCard = await Card.findOne({
      cardNumber: fromNorm,
      userId: req._id,
    });
    const toCard = await Card.findOne({
      cardNumber: toNorm,
      userId: req._id,
    });

    if (!fromCard || !toCard) {
      return res.status(404).json({ message: "One or both cards were not found on your account." });
    }

    const expFrom = validateExpiry(fromCard.expireDate);
    const expTo = validateExpiry(toCard.expireDate);
    if (!expFrom.ok || !expTo.ok) {
      return res.status(400).json({ message: "Cannot transfer using an expired card." });
    }

    if (fromCard.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance on the source card." });
    }

    fromCard.balance -= amt;
    toCard.balance += amt;
    await fromCard.save();
    await toCard.save();

    const memo = String(req.body.description || "").trim();
    const debitDesc = memo || `Transfer to ····${toNorm.slice(-4)}`;
    const creditDesc = memo || `Transfer from ····${fromNorm.slice(-4)}`;

    await new Transaction({
      userId: req._id,
      cardNumber: fromNorm,
      toCardNumber: toNorm,
      amount: amt,
      description: debitDesc,
      type: "card_transfer",
      direction: "debit",
    }).save();

    await new Transaction({
      userId: req._id,
      cardNumber: toNorm,
      toCardNumber: fromNorm,
      amount: amt,
      description: creditDesc,
      type: "card_transfer",
      direction: "credit",
    }).save();

    return res.json({
      message: "Transfer between cards completed.",
      fromBalance: fromCard.balance,
      toBalance: toCard.balance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Card transfer failed." });
  }
};

module.exports = {
  addCard,
  getCards,
  makeTransaction,
  getTransactions,
  updateCardBalance,
  transferBetweenCards,
};
