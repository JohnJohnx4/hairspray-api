const stripe = require('stripe')('sk_test_vY2PFCv47VGRTiS3Cb9c7uky');

const fulfillRequest = res => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(500).send({ error: stripeErr });
  } else {
    res.status(200).send({ success: stripeRes });
  }
};

const createCharge = (req, res) => {
  stripe.charges.create(req.body, fulfillRequest(res));
};


module.exports = {
  createCharge
};
