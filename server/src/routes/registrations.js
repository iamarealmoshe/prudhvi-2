import crypto from 'crypto';
import { Router } from 'express';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

export const registrationsRouter = Router();

registrationsRouter.post('/', async (req, res, next) => {
  try {
    const { eventId, attendee, ticketType, quantity } = req.body;
    const ticketQuantity = Number(quantity);

    if (!eventId || !attendee || !ticketType || !Number.isInteger(ticketQuantity)) {
      return res.status(400).json({ message: 'Missing required registration details.' });
    }

    if (ticketQuantity < 1 || ticketQuantity > 10) {
      return res.status(400).json({ message: 'Ticket quantity must be between 1 and 10.' });
    }

    if (!attendee.fullName || !attendee.email || !attendee.phone) {
      return res.status(400).json({ message: 'Attendee name, email, and phone are required.' });
    }

    const baseEvent = await Event.findById(eventId);

    if (!baseEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const selectedTicket = baseEvent.ticketTypes.find((ticket) => ticket.name === ticketType);

    if (!selectedTicket) {
      return res.status(400).json({ message: 'Selected ticket type is not available.' });
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: {
          $lte: [{ $add: ['$registeredCount', ticketQuantity] }, '$capacity']
        }
      },
      { $inc: { registeredCount: ticketQuantity } },
      { new: true }
    );

    if (!event) {
      return res.status(409).json({
        message: 'Registration limit reached. Not enough seats are available for this event.'
      });
    }

    const registration = await Registration.create({
      event: event._id,
      attendee,
      ticketType,
      quantity: ticketQuantity,
      totalPrice: selectedTicket.price * ticketQuantity,
      confirmationCode: crypto.randomBytes(4).toString('hex').toUpperCase()
    });

    res.status(201).json({
      registration,
      event: {
        id: event._id,
        title: event.title,
        startsAt: event.startsAt,
        location: event.location,
        remainingSeats: event.remainingSeats
      }
    });
  } catch (error) {
    next(error);
  }
});
