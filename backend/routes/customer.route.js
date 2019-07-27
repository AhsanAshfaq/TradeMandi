const express = require('express');
const customerRoute = express.Router();

let Customer = require('../model/Customer');
// Customer model

customerRoute.route('/customer').post((req, res, next) => {
    Customer.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

customerRoute.route('/customers').get((req, res) => {
    Customer.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

customerRoute.route('/customer/:id').get((req, res) => {
    Customer.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})


customerRoute.route('/customer/:id').put((req, res, next) => {
    Customer.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
        }
    })
})

customerRoute.route('/customer/:id').delete((req, res, next) => {
    Customer.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = customerRoute;
