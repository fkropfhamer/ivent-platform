const express = require('express');
const router = express.Router();

const userRouter = require('./api/users');
const eventRouter = require('./api/events');

router.use('/users/', userRouter);
router.use('/events/', eventRouter);


module.exports = router;
