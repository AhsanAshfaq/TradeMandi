const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Sale = new Schema({},{
  collection: 'sales'
});

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
  numberOfBags: Number,
  date: Date,
  qty: Number,
  rate: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers'
  },
  totalAmount: Number,
  paymentType: {
    type: String,
    enum: ['none', 'Cash', 'Credit'],
    default: 'Cash'
  }
});

Sale.add({
  builtyNumber: String,
  truckNumber: String,
  truckRent: Number,
  commission: Number,
  labour: Number,
  marketCommittee: Number,
  munshiana: Number,
  saleDate: Date,
  saleDetails: [SaleDetail]
});


module.exports = mongoose.model('Sale', Sale)
module.exports = mongoose.model('SaleDetail', SaleDetail)
