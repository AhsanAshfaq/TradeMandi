const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Customer = new Schema({
    name: String,
    phone: String,
    address: String,
    city: String,
    balance: Number
}, {
        collection: 'customers'
    })

module.exports = mongoose.model('Customer', Customer)
