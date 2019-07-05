const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    name: String,
    quantity: String,
    type: String,
    description: String,
    purchase_warning_limit: Number
}, {
        collection: 'products'
    })

module.exports = mongoose.model('Product', Product)
