const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Retornar horários disponíveis para uma data e serviço específicos
router.get('/disponiveis', async (req, res) => {
    try {
        const { date, service } = req.query;
        if (!date || !service) {
            return res.status(400).json({ message: 'Data e serviço são obrigatórios' });
        }

        const busyTimes = await Appointment.findAll({
            where: { date, service },
            attributes: ['time'],
        });

        const busyTimesList = busyTimes.map(apt => apt.time);
        const businessHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        const availableTimes = businessHours.filter(time => !busyTimesList.includes(time));

        res.json(availableTimes);
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        res.status(500).json({ message: 'Erro ao buscar horários' });
    }
});

module.exports = router;
