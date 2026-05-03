const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userControllers");
const { validateToken } = require("../middlewares/validation");
const {
  addCard,
  getCards,
  makeTransaction,
  getTransactions,
} = require("../controllers/cardInfoControllers");

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", validateToken, getUser);

router.post("/cards", validateToken, addCard);

router.get("/cards", validateToken, getCards);

router.get("/transactions", validateToken, getTransactions);

router.post("/transaction", validateToken, makeTransaction);

module.exports = router;
