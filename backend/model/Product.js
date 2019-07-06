const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
  name: String,
  quantity: Number,
  unit: {
    type: String,
    enum: ['none', 'Kg', 'Bag', 'Crate'],
    default: 'Bag'
  },
  description: String,
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'purchases'
  }],
  purchase_warning_limit: Number
}, {
  collection: 'products'
})

module.exports = mongoose.model('Product', Product)
