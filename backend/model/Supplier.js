const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Supplier = new Schema({
    name: String,
    phone: String,
    address: String,
    city: String,
    balance: Number,
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
    purchases: [{type: mongoose.Schema.Types.ObjectId, ref: 'purcahses'}]
}, {
        collection: 'suppliers'
    })

module.exports = mongoose.model('Supplier', Supplier)