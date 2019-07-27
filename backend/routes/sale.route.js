const express = require('express');
const saleRoute = express.Router();

let Sale = require('../model/Sale');
let Supplier = require('../model/Supplier');
let SaleDetail = require('../model/SaleDetail');

saleRoute.route('/sale').post((req, res, next) => {
  Sale.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      Supplier.findById(data.supplier, (error, supplier) => {
        if (error) {
          return next(error);
        } else {
          supplier.sales.push(data);
          supplier.save();
          res.json(data);
        }
      });
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
      throw error;
    } else {
      res.json(data)
    }
  }).populate('customers').populate('products').exec();
})

saleRoute.route('/sale/:truckNumber').get((req, res) => {
  Sale.findOne({truckNumber : req.params.truckNumber}, (error, data) => {
    if (error) {
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
