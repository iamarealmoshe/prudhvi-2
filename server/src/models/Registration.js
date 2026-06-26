import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    attendee: {
      type: attendeeSchema,
      required: true
    },
    ticketType: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    confirmationCode: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export const Registration = mongoose.model('Registration', registrationSchema);
