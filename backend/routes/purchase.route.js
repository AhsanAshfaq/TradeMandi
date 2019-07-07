const express = require('express');
const purchaseRoute = express.Router();

let Purchase = require('../model/Purchase');
let Product = require('../model/Product');
let Supplier = require('../model/Supplier');

purchaseRoute.route('/purchase').post((req, res, next) => {

  const product = Product.findById(req.body.product, function (err, result) {
    result.quantity += parseInt(req.param('quantity'));
    result.save();
  });

  const supplier = Supplier.findById(req.body.supplier, function (err, result) {
    if (req.param('paymentType') == 'Credit') {
      if (result.balance) {
        result.balance += parseInt(req.param('amount'));
      } else {
        result['balance'] += parseInt(req.param('amount'));
      }
      result.save();
    }
  });

  Purchase.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      Purchase.product = product;
      Purchase.supplier = supplier;
      res.json(data)
    }
  })
});

purchaseRoute.route('/purchases').get((req, res) => {
  Purchase.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

purchaseRoute.route('/purchase/:id').get((req, res) => {
  Purchase.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).populate('suppliers').populate('products').exec();
})


purchaseRoute.route('/purchase/:id').put((req, res, next) => {
  Purchase.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Purchase successfully updated!')
    }
  })
})

purchaseRoute.route('/purchase/:id').delete((req, res, next) => {
  Purchase.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = purchaseRoute;
