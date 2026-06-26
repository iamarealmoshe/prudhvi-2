import 'dotenv/config';
import { connectDb } from './config/db.js';
import { Event } from './models/Event.js';

await connectDb();

await Event.deleteMany({});

const event = await Event.create({
  title: 'MERN Innovators Summit',
  description:
    'A hands-on event for builders learning modern full-stack patterns, product workflows, and launch-ready engineering practices.',
  location: 'Hyderabad Convention Centre',
  startsAt: new Date('2026-09-18T09:30:00+05:30'),
  capacity: 120,
  registeredCount: 0,
  ticketTypes: [
    { name: 'Standard', price: 999 },
    { name: 'Student', price: 499 },
    { name: 'VIP', price: 1999 }
  ]
});

console.log(`Seeded event: ${event.title}`);
process.exit(0);
