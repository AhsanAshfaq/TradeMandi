const express = require('express');
const saleDetailRoute = express.Router();

let SaleDetail = require('../model/SaleDetail');
let Product = require('../model/Product');
let Customer = require('../model/Customer');

saleDetailRoute.route('/saledetail').post((req, res, next) => {

  // const sale = Product.findById(req.body.product, function (err, result) {
  //   result.quantity -= parseInt(req.param('quantity'));
  //   result.save();
  // });

  // const customer = Customer.findById(req.body.supplier, function (err, result) {
  //   if (req.param('paymentType') == 'Credit') {
  //     if (result.balance) {
  //       result.balance += parseInt(req.param('totalAmount'));
  //     } else {
  //       result['balance'] += parseInt(req.param('totalAmount'));
  //     }
  //     result.save();
  //   }
  // });
  SaleDetail.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

saleDetailRoute.route('/saledetails').get((req, res) => {
  SaleDetail.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

saleDetailRoute.route('/saledetail/:id').get((req, res) => {
  SaleDetail.findById(req.params.id, (error, data) => {
    if (error) {
      throw error;
    } else {
      res.json(data)
    }
  }).populate('customers').populate('products').exec();
})

saleDetailRoute.route('/saledetail/:id').put((req, res, next) => {
  SaleDetail.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})

saleDetailRoute.route('/saledetail/:id').delete((req, res, next) => {
  SaleDetail.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = saleDetailRoute;
