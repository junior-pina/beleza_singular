const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const Client = require('../models/Cliente');
const auth = require('../middleware/auth');

// 📌 Lista todos os agendamentos
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [Client],
      order: [['date', 'ASC']],
    });
    res.json(appointments);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});

// 📌 Cria um novo agendamento
router.post('/', auth, async (req, res) => {
  try {
    const { clientId, service, date, time } = req.body;

    if (!clientId || !service || !date || !time) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verifica se o horário já está ocupado
    const horarioExistente = await Appointment.findOne({
      where: { date, time },
    });

    if (horarioExistente) {
      return res.status(400).json({ message: 'Horário já está ocupado!' });
    }

    const appointment = await Appointment.create({ clientId, service, date, time });

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(400).json({ message: 'Erro ao criar agendamento' });
  }
});

// 📌 Atualiza um agendamento existente
router.put('/:id', auth, async (req, res) => {
  try {
    const { service, date, time } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    await appointment.update({ service, date, time });
    res.json(appointment);
  } catch (err) {
    console.error('Erro ao atualizar agendamento:', err);
    res.status(400).json({ message: 'Erro ao atualizar agendamento' });
  }
});

// 📌 Deleta um agendamento
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    await appointment.destroy();
    res.json({ message: 'Agendamento deletado' });
  } catch (err) {
    console.error('Erro ao deletar agendamento:', err);
    res.status(500).json({ message: 'Erro ao deletar agendamento' });
  }
});

// 📌 Obtém horários disponíveis para uma data e serviço
router.get('/available', async (req, res) => {
  try {
    const { date, service } = req.query;
    if (!date || !service) {
      return res.status(400).json({ message: 'Data e serviço são obrigatórios' });
    }

    // Buscar horários já agendados
    const busyTimes = await Appointment.findAll({
      where: { date, service },
      attributes: ['time'],
    });

    const busyTimesList = busyTimes.map((apt) => apt.time);

    // Horários padrão do salão
    const businessHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    // Retorna apenas os horários que ainda estão disponíveis
    const availableTimes = businessHours.filter((time) => !busyTimesList.includes(time));

    res.json(availableTimes);
  } catch (err) {
    console.error('Erro ao buscar horários disponíveis:', err);
    res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
  }
});

// 📌 Criar um agendamento público (sem login)
router.post('/public', async (req, res) => {
  try {
    const { name, email, phone, service, date, time } = req.body;

    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Criar ou buscar cliente
    const [client] = await Client.findOrCreate({
      where: { email },
      defaults: { name, phone },
    });

    // Verifica se o horário já está ocupado
    const horarioExistente = await Appointment.findOne({
      where: { date, time },
    });

    if (horarioExistente) {
      return res.status(400).json({ message: 'Horário já está ocupado!' });
    }

    // Criar agendamento
    const appointment = await Appointment.create({
      clientId: client.id,
      service,
      date,
      time,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Erro ao criar agendamento público:', err);
    res.status(400).json({ message: 'Erro ao criar agendamento' });
  }
});

module.exports = router;
