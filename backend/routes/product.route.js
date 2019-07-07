const express = require('express');
const productRoute = express.Router();

let Product = require('../model/Product');
// Product model

productRoute.route('/product').post((req, res, next) => {
    Product.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

productRoute.route('/products').get((req, res) => {
    Product.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

productRoute.route('/product/:id').get((req, res) => {
    Product.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

productRoute.route('/product/:name').get((req, res) => {
  Product.findOne({'name': req.params.name}, (error, data) => {
      if (error) {
          return next(error)
      } else {
          res.json(data)
      }
  })
})


productRoute.route('/product/:id').put((req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
        }
    })
})

productRoute.route('/product/:id').delete((req, res, next) => {
    Product.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = productRoute;
