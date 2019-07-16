const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Sale = new Schema({},{
  collection: 'sales'
});
let SaleDetail = new Schema({},{
  collection: 'saleDetails'
});
var LineItem = new Schema({},{
  collection: 'lineItems'
});

LineItem.add({
  date: Date,
  Qty: Number,
  Rate: Number,
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
  lineItems: [LineItem]
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
module.exports = mongoose.model('LineItem', LineItem)
