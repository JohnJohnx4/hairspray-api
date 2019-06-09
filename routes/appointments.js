const appointments = require('../controllers/appointmentController');
const router = require('express').Router();

router
.route('/')
.get(appointments.GET)
.post(appointments.POST);
router.route('/date').post(appointments.SEARCHBY_DATE);
router.route('/stylist/:id').get(appointments.STYLIST_GET);
router.route('/date/stylist/:id').post(appointments.SEARCHBY_DATE_STYLIST);

router
  .route('/:id')
  .get(appointments.GET_ONE)
  .put(appointments.PUT)
  .delete(appointments.DELETE);

module.exports = router;
