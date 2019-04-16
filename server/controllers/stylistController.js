const Stylist = require('../models/Stylist.js');
const { stylistToken } = require('../config/auth');

// endpoint to create a new stylist and save to database
const createStylist = (req, res) => {
  if (!req.body.stylist)
    return res.status(500).json({ error: 'No Stylist submitted' });
  const newStylist = req.body.stylist;
  const stylist = new Stylist(newStylist);
  stylist
    .save()
    .then(success => {
      res.status(200).json({
        success: 'Stylist was saved',
        token: stylistToken({
          username: success.email
        })
      });
    })
    .catch(err => res.status(500).send({ error: err.message }));
};

// testing endpoint to see all stylists
const getAllStylists = (req, res) => {
  Stylist.find({}, (err, stylists) => {
    res.send(stylists);
  });
};

const getStylist = (req, res) => {
  const { id } = req.params;
  Stylist.findById(id).exec((err, stylist) => {
    if (err) {
      res.status(422).json({ error: 'error getting stylist' });
      return;
    }
    if (stylist === null) res.status(422).json({ error: `No stylist found` });
    res.json(stylist);
  });
};

const updateStylist = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  Stylist.findByIdAndUpdate(id, { name, email }, { new: true }).exec(
    (err, stylist) => {
      if (err) {
        res.status(404).json({ error: 'Could not find that stylist' });
      }
      res.status(200).json({ success: stylist });
    }
  );
};

const deleteStylist = (req, res) => {
  const { id } = req.params;
  Stylist.findByIdAndRemove(id)
    .then(deleted => {
      if (deleted === null) {
        return res.status(404).json({ error: 'Stylist not found' });
      }
      return res.status(200).json({
        success: 'Deleted successfully'
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
};

module.exports = {
  POST: createStylist,
  STYLIST_GET: getStylist,
  GET: getAllStylists,
  PUT: updateStylist,
  DELETE: deleteStylist
};
