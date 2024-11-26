const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Signup route
routes.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hash,
            phone: req.body.phone,
            email: req.body.email,
            userType: req.body.userType,
        });

        user.save()
            .then(result => {
                return res.status(201).json({
                    message: 'User created successfully',
                    new_user: result
                });
            })
            .catch(err => {
                return res.status(500).json({
                    error: err.message
                });
            });
    });
});

// Login route
routes.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username }) // Use findOne for better clarity
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    msg: 'User does not exist'
                });
            }

            // Compare passwords
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({
                        msg: 'Password does not match'
                    });
                }
                if(result)
                {
                    const token = jwt.sign({
                        username:user[0].username,
                        userType:user[0].userType,
                        email:user[0].email,
                        phone:user[0].phone,
                    },
                     'this is dummy text',
                    
                    
                    {
                        expiresIn:"24h"
                    }
                );
                res.status(200).json({
                    msg: 'Login successful',
                    user: {
                        id: user._id,
                        username: user[0].username,
                        userType: user[0].userType,
                        email: user[0].email,
                        phone: user[0].phone,
                    
                    },
                    token: token
                })
                }

                // Successful login
                return res.status(200).json({
                    msg: 'Login successful',
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        userType: user.userType,
                    }
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

module.exports = routes;
