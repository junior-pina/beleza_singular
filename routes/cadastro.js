const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Modelo de Usuário

// ✅ Rota de cadastro
router.post('/cadastro', [
    body('nome').notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('telefone').notEmpty().withMessage('O telefone é obrigatório'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
    try {
        // 📌 Validação dos dados recebidos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let { nome, email, telefone, senha } = req.body;

        // 🔍 Garantindo que o e-mail seja tratado corretamente
        email = email.trim().toLowerCase();

        // 🔍 Verifica se o usuário já existe no banco de dados
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Usuário já cadastrado!' });
        }

        // 🔑 Hash da senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(senha, 10); // 🔥 Sem gerar salt manualmente
        console.log("✅ Senha hashada antes de salvar no banco:", hashedPassword);

        // ✅ Criar um novo usuário no banco
        await User.create({
            nome,
            email,
            telefone,
            senha: hashedPassword // 🔥 Senha sempre criptografada
        });

        console.log("✅ Usuário cadastrado com sucesso:", email);

        // ✅ Resposta JSON para frontend
        res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error('❌ Erro ao cadastrar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário. Tente novamente!' });
    }
});

module.exports = router;
