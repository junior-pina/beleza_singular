const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo de Usuário

// ✅ Rota de cadastro
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já cadastrado!' });
        }

        // Criar um novo usuário
        await User.create({
            name: nome,
            email: email,
            telefone: telefone,
            password: senha
        });

        // ✅ Redireciona para a página de login
        res.redirect('/login');

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).render('erro', { mensagem: 'Erro ao cadastrar usuário. Tente novamente!' });
    }
});

module.exports = router;
