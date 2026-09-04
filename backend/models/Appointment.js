const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  //which doctor this appointment belongs to
  // (this isn't just any text it's a real link to a User document)
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,  // stores a MongoDB ID, not plain text
    ref: 'User',                            // tells Mongoose: this ID points to the Users collection
    required: true,
  },

  //which patient this appointment belongs to (same linking idea)
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  //appointment date
  date: {
    type: String,
    required: true,
  },

  // Step 4: appoimtment time
  time: {
    type: String,
    required: true,
  },

  //current status : only 3 allowed values
  // if nothing is specified when creating one, it defaults to "requested"
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'cancelled'],
    default: 'requested',
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);