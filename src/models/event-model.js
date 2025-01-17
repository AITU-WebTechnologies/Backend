const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const EventSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    unique: true,
  },
  creatorEmail: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  emailFields: {
    type: [String],
    required: true,
  },
  participants: {
    type: [
      {
        name: {
          type: String,
        },
        iin: {
          type: String,
        },
        status: {
          type: String,
          default: 'Не посетил'
        },
      },
    ],
    required: true,
  },
});

EventSchema.plugin(AutoIncrement, { inc_field: 'eventId' });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
