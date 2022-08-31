const express = require('express');
const router = express.Router();

const userRouter = require('./api/users');
const eventRouter = require('./api/events');
const authRouter = require('./api/auth').router; 

router.use('/users/', userRouter);
router.use('/events/', eventRouter);
router.use('/auth', authRouter);


module.exports = router;
