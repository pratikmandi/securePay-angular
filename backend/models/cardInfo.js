const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
    balance: {
        type: Number,
    },
    cardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    cardType: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    expireDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Card", CardSchema)