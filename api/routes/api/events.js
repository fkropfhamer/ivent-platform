const express = require('express');
const { Event } = require('../../data/models');
const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find();

  res.json(events);
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;

  const newEvent =  new Event({ title, description });

  await newEvent.save();

  res.json(newEvent);
});

router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId).exec();

  if (!event) {
    return res.status(404).json({ status: 'event not found'});
  }
    
  res.json(event);  
});

router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  await Event.deleteOne({ _id: eventId});

  res.json({ success: true });
});

module.exports = router;
