require('dotenv').config();
const secret = process.env.JWT_TOKEN;   
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');


router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
            if (!user) 
                res.status(401).json({error: 'Incorrect email or password'});
            else {
                user.isCorrectPassword(password, function(err, same) {
                    if (!same) 
                    res.status(401).json({error: 'Incorrect email or password'});
                else {
                    const token = jwt.sign({email}, secret, { expiresIn: '10d' });
                    res.json({user: user, token: token});
                }
                });
            }
    } catch (error) {
    res.status(500).json({error: 'Internal error, plase try again'})    
    }
    }
);

router.post('/register', async(req, res) => {
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
  try {
      await user.save();
      res.status(200).json(user)
}     catch (err) {
      res.status(500).json({message: err.message})}
  });


module.exports = router;
