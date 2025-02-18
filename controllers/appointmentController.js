const Appointment = require('../models/Appointment'); // Ajuste para o modelo correto

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos', error });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar agendamento', error });
    }
};
