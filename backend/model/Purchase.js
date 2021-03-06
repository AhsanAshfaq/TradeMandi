const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Purchase = new Schema({
  builtyNumber: String,
  amount: String,
  quantity: Number,
  purchaseDate: Date,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'suppliers'
  },
  truckNumber: String,
  paymentType: {
    type: String,
    enum: ['none', 'Cash', 'Credit'],
    default: 'Cash'
  }
}, {
  collection: 'purchases'
})

module.exports = mongoose.model('Purchase', Purchase)
