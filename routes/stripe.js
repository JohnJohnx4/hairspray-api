const stripe = require('../controllers/userController');
const router = require('express').Router();
const { validateToken } = require('../config/auth');

router.route('/').post(validateToken, stripe.createCharge);

module.exports = router;