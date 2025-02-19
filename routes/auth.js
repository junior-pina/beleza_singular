const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = 'seuSegredoSuperSeguro';

/** ===================== ✅ Rota de Cadastro ===================== **/
router.post('/cadastro', [
    body('nome').notEmpty().trim().escape().withMessage('O nome é obrigatório'),
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('telefone').notEmpty().trim().escape().withMessage('O telefone é obrigatório'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("❌ Erro de validação:", errors.array());
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }

        let { nome, email, telefone, senha } = req.body;
        email = email.trim().toLowerCase();

        if (await User.findOne({ where: { email } })) {
            console.log(`⚠️ E-mail já cadastrado: ${email}`);
            return res.status(400).json({ success: false, message: 'E-mail já cadastrado!' });
        }

        if (await User.findOne({ where: { telefone } })) {
            console.log(`⚠️ Telefone já cadastrado: ${telefone}`);
            return res.status(400).json({ success: false, message: 'Telefone já cadastrado!' });
        }

        // 🔑 Hash da senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(senha, 12);
        console.log(`🔒 Senha digitada: ${senha}`);
        console.log(`🔐 Senha hashada: ${hashedPassword}`);

        // ✅ Criar usuário
        const user = await User.create({ nome, email, telefone, senha: hashedPassword });
        console.log(`✅ Usuário cadastrado com sucesso: ${email}`);

        res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('❌ Erro ao cadastrar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário. Tente novamente!' });
    }
});

/** ===================== ✅ Rota de Login ===================== **/
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('senha').notEmpty().withMessage('A senha é obrigatória')
    
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("❌ Erro de validação no login:", errors.array());
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        console.log(`📌 Requisição de login recebida: ${JSON.stringify(req.body)}`);


        const { email, senha } = req.body;
        console.log(`📧 Tentando login com email: ${email}`);

        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

        if (!user) {
            console.log(`⚠️ Usuário não encontrado no banco: ${email}`);
            return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
        }

        console.log(`✅ Usuário encontrado: ${user.email}`);
        console.log(`🔒 Senha salva no banco: ${user.senha}`);
        console.log(`🔑 Senha digitada no login: ${senha}`);

        // Comparar senha digitada com a senha hashada do banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        console.log(`🔍 Senha corresponde? ${isMatch}`);

        if (!isMatch) {
            console.log("❌ Senha incorreta!");
            return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
        }

        // 🔑 Gerar token JWT
        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        console.log(`✅ Login realizado com sucesso: ${email}`);
        res.json({ success: true, message: 'Login realizado com sucesso!', token });

    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
});

module.exports = router;
