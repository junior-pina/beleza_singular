const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Client = require('../models/Cliente');
const auth = require('../middleware/auth');

// Get all appointments
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [Client],
      order: [['date', 'ASC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.destroy();
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available times
router.get('/available', async (req, res) => {
  try {
    const { date, service } = req.query;
    
    // Get all appointments for the requested date
    const busyTimes = await Appointment.findAll({
      where: {
        date,
        service
      },
      attributes: ['time']
    });

    // Define business hours
    const businessHours = [
      '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Filter out busy times
    const busyTimesList = busyTimes.map(apt => apt.time);
    const availableTimes = businessHours.filter(time => !busyTimesList.includes(time));

    res.json(availableTimes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public appointment creation
router.post('/public', async (req, res) => {
  try {
    // First create or find the client
    const [client] = await Client.findOrCreate({
      where: { email: req.body.email },
      defaults: {
        name: req.body.name,
        phone: req.body.phone
      }
    });

    // Then create the appointment
    const appointment = await Appointment.create({
      clientId: client.id,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;