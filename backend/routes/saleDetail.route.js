const express = require('express');
const saleDetailRoute = express.Router();

let SaleDetail = require('../model/SaleDetail');
let Sale = require('../model/Sale');

saleDetailRoute.route('/saledetail').post((req, res, next) => {
  SaleDetail.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      Sale.findById(data.sale, (error, sale) => {
        if (error) {
          return next(error);
        } else {
          sale.saleDetails.push(data);
          sale.save();
          res.json(data);
        }
      });
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

saleDetailRoute.route('/saledetails/sale/:id').get((req, res) => {
  Sale.findById(req.params.id, (err, sale) => {
    SaleDetail.find({ sale: req.params.id }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        sale.saleDetails.push(data);
        res.json(data)
      }
    })
  });

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
