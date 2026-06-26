import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    startsAt: {
      type: Date,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    ticketTypes: {
      type: [ticketTypeSchema],
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: 'At least one ticket type is required.'
      }
    }
  },
  { timestamps: true }
);

eventSchema.virtual('remainingSeats').get(function getRemainingSeats() {
  return Math.max(this.capacity - this.registeredCount, 0);
});

eventSchema.set('toJSON', { virtuals: true });

export const Event = mongoose.model('Event', eventSchema);
