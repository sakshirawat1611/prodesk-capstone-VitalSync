const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { z } = require('zod');

const appointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string(),
  time: z.string(),
});

// CREATE — Patient books a new appointment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const result = appointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const { doctorId, date, time } = req.body;

    const newAppointment = new Appointment({
      doctorId,
      patientId: req.userId,
      date,
      time,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// read: Get appointments (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    let appointments;
    if (user.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: req.userId });
    } else {
      appointments = await Appointment.find({ patientId: req.userId });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

});

// read: Get a single appointment by ID, with ownership check
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isOwner =
      appointment.doctorId.toString() === req.userId ||
      appointment.patientId.toString() === req.userId;

    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden: not your appointment' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// update: Doctor updates appointment status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isDoctorOwner = appointment.doctorId.toString() === req.userId;

    if (!isDoctorOwner) {
      return res.status(403).json({ message: 'Forbidden: only the assigned doctor can update this appointment' });
    }

    const { status } = req.body;
    const validStatuses = ['requested', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' })
    }
    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// delete-Doctor permanently removes an appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isDoctorOwner = appointment.doctorId.toString() === req.userId;

    if (!isDoctorOwner) {
      return res.status(403).json({ message: 'Forbidden: only the assigned doctor can delete this appointment' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;