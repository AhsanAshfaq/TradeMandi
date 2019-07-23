const express = require('express');
const saleRoute = express.Router();

let Sale = require('../model/Sale');
let Product = require('../model/Product');
let Customer = require('../model/Customer');

saleRoute.route('/sale').post((req, res, next) => {

  const sale = Product.findById(req.body.product, function (err, result) {
    result.quantity += parseInt(req.param('quantity'));
    result.save();
  });

  const customer = Customer.findById(req.body.supplier, function (err, result) {
    if (req.param('paymentType') == 'Credit') {
      if (result.balance) {
        result.balance += parseInt(req.param('amount'));
      } else {
        result['balance'] += parseInt(req.param('amount'));
      }
      result.save();
    }
  });

  Sale.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      Sale.sale = sale;
      Sale.customer = customer;
      res.json(data)
    }
  })
});

saleRoute.route('/sales').get((req, res) => {
  Sale.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

saleRoute.route('/sale/:id').get((req, res) => {
  Sale.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).populate('customers').populate('products').exec();
})

saleRoute.route('/sale/:truckNumber').get((req, res) => {
  Sale.findOne({truckNumber : req.params.truckNumber}, (error, data) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      res.json(data)
    }
  }).populate('customers').populate('products').populate('saleDetails').exec();
})


saleRoute.route('/sale/:id').put((req, res, next) => {
  Sale.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})

saleRoute.route('/sale/:id').delete((req, res, next) => {
  Sale.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = saleRoute;
