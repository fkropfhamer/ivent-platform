const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

module.exports = router;
