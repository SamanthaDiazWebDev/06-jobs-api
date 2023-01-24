const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


const auth = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1]; //turn it into array

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach the user to the inmate routes
        req.user = { userId: payload.userId , name:payload.name }; //we sent this info to the user

        // const user = User.findById(payload.id).select('-password') : remove password
        // req.user = user
        
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = auth;