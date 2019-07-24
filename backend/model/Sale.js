const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Sale = new Schema({},{
  collection: 'sales'
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
  grossTotal: Number,
  netTotal: Number,
  saleDetails: []
});


module.exports = mongoose.model('Sale', Sale)

