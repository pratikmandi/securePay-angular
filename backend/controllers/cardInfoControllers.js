const Card = require("../models/cardInfo");
const Transaction = require("../models/transaction");

const addCard = async (req, res) => {
  const { cardHolderName, cardNumber, balance, expireDate } = req.body;

  const card = new Card({
    cardHolderName,
    cardNumber,
    balance,
    expireDate,
    userId: req._id,
  });

  const cardDetails = await card.save();
  return res.send(cardDetails);
};

const getCards = async (req, res) => {
  const cards = await Card.find({ userId: req._id });

  res.json(cards);
};

const makeTransaction = async (req, res) => {
  const { cardNumber, amount, description } = req.body;

  const card = await Card.findOne({ cardNumber });

  if (!card) {
    return res.status(404).send("Card not found");
  }

  if (card.balance < amount) {
    return res.status(400).send("Insufficient balance");
  }

  // deduct balance
  card.balance -= amount;
  await card.save();

  // save transaction
  const transaction = new Transaction({
    userId: req._id,
    cardNumber,
    amount,
    description,
  });

  await transaction.save();

  res.json({
    message: "Transaction successful",
    balance: card.balance,
  });
};

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    userId: req._id,
  }).sort({ date: -1 });

  res.json(transactions);
};

module.exports = { addCard, getCards, makeTransaction, getTransactions };
