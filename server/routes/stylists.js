const stylists = require('../controllers/stylistController');
const router = require('express').Router();
const { validateToken } = require('../config/auth');

router
  .route('/')
  .get(stylists.GET)
  .post(stylists.POST);
router
  .route('/:id')
  .get(stylists.STYLIST_GET)
  .put(validateToken, stylists.PUT)
  .delete(validateToken, stylists.DELETE);

module.exports = router;
