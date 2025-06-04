const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    console.log(`Middleware called for route: ${req.originalUrl}`);

    const { authorization } = req.headers;
    // authorization === 'Bearer kfdsrdtfyghj'

    if (!authorization) {
        return res.status(401).send({ error: 'You must be loggged in.' })
    }
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' + err});
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();

    });
};