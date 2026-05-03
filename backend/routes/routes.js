const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateProfile,
} = require("../controllers/userControllers");
const { validateToken } = require("../middlewares/validation");
const {
  addCard,
  getCards,
  makeTransaction,
  getTransactions,
  updateCardBalance,
  transferBetweenCards,
} = require("../controllers/cardInfoControllers");

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/user", validateToken, getUser);

router.patch("/user/profile", validateToken, updateProfile);

router.post("/cards", validateToken, addCard);

router.get("/cards", validateToken, getCards);

router.patch("/cards/:cardId/balance", validateToken, updateCardBalance);

router.get("/transactions", validateToken, getTransactions);

router.post("/transaction", validateToken, makeTransaction);

router.post("/transfer-between-cards", validateToken, transferBetweenCards);

module.exports = router;
