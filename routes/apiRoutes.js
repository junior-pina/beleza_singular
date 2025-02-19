const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const clientRoutes = require('./clients');
const appointmentRoutes = require('./appointments');
const cadastroRoutes = require('./cadastro'); // Importa a nova rota

// ✅ Definindo as rotas principais da API
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/cadastro', cadastroRoutes); // Adicionando o cadastro

module.exports = router;
