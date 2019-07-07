const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Sale = new Schema({
  builtyNumber: String,
  amount: String,
  quantity: Number,
  saleDate: Date,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers'
  },
  truckNumber: String,
  paymentType: {
    type: String,
    enum: ['none', 'Cash', 'Credit'],
    default: 'Cash'
  }
}, {
  collection: 'sales'
})

module.exports = mongoose.model('Sale', Sale)
