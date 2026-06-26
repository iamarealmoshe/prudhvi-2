import { Router } from 'express';
import { Event } from '../models/Event.js';

export const eventsRouter = Router();

eventsRouter.get('/', async (_req, res, next) => {
  try {
    const events = await Event.find().sort({ startsAt: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

eventsRouter.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});
