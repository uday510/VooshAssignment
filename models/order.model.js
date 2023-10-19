const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for user details
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String
    }
});

module.exports = mongoose.model("Order", orderSchema);
