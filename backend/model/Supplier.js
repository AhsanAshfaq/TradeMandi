const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Supplier = new Schema({
    name: String,
    phone: String,
    address: String,
    city: String,
    balance: Number
}, {
        collection: 'suppliers'
    })

module.exports = mongoose.model('Supplier', Supplier)
