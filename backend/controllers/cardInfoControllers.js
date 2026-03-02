const Card = require('../models/cardInfo')

const addCard = async (req, res) => {
    const {cardHolderName, cardNumber, balance, expireDate} = req.body

    const card = new Card({
        cardHolderName: cardHolderName,
        cardNumber: cardNumber,
        balance: balance,
        expireDate: expireDate
    })

    const cardDetails = await card.save()
    return res.send(cardDetails)
}

module.exports = {addCard}