const express = require('express');
const router = express.Router();
const molecule = require('../services/molecule');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await molecule.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting Molecule`, err.message);
    next(err);
  }
});

/* POST programming language */
router.post('/', async function(req, res, next) {
  try {
    res.json(await molecule.create(req.body));
  } catch (err) {
    console.error(`Error while creating Molecule`, err.message);
    next(err);
  }
});
module.exports = router;