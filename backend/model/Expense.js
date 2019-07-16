const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Expense = new Schema({
    name: String,
    description: String,
    expenseDate: Date,
    city: String,
    balance: Number
}, {
        collection: 'customers'
    })

module.exports = mongoose.model('Customer', Customer)
