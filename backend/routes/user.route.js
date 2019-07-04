import express, { Router } from 'express';
const app = express();
const userRoute = Router();

// User model
import { create, find, findById, findByIdAndUpdate, findByIdAndRemove } from '../model/User';

userRoute.route('/user').post((req, res, next) => {
    create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

userRoute.route('/users').get((req, res) => {
    find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

userRoute.route('/user/:id').get((req, res) => {
    findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})


userRoute.route('/user/:id').put((req, res, next) => {
    findByIdAndUpdate(req.params.id, {
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

userRoute.route('/user/:id').delete((req, res, next) => {
    findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

export default userRoute;