const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SaleDetail = new Schema({},{
  collection: 'saleDetails'
});

SaleDetail.add({
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sales'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers'
  },
  date: String,
  qty: Number,
  rate: Number,
  totalAmount: Number,
  paymentType: String
});

module.exports = mongoose.model('SaleDetail', SaleDetail)
