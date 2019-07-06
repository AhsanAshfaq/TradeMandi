const express = require('express');
const supplierRoute = express.Router();

let Supplier = require('../model/Supplier');
// Supplier model

supplierRoute.route('/supplier').post((req, res, next) => {
  Supplier.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

supplierRoute.route('/suppliers').get((req, res) => {
  Supplier.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

supplierRoute.route('/supplier/:id').get((req, res) => {
  Supplier.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})


supplierRoute.route('/supplier/:id').put((req, res, next) => {
  Supplier.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
})

supplierRoute.route('/supplier/:id').delete((req, res, next) => {
  Supplier.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = supplierRoute;
