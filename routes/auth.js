  const express = require('express');
  const router = express.Router();
  const { body, validationResult } = require('express-validator');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User'); // Modelo de Usuário

  const SECRET_KEY = 'seuSegredoSuperSeguro'; // 🔐 Substitua isso por uma variável de ambiente

  // ✅ Rota de cadastro com JWT
  router.post('/cadastro', [
      body('nome').notEmpty().trim().escape().withMessage('O nome é obrigatório'),
      body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
      body('telefone').notEmpty().trim().escape().withMessage('O telefone é obrigatório'),
      body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
  ], async (req, res) => {
      try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
          }

          let { nome, email, telefone, senha } = req.body;
          email = email.trim().toLowerCase();

          // 🔍 Verifica duplicidade
          if (await User.findOne({ where: { email } })) {
              return res.status(400).json({ success: false, message: 'E-mail já cadastrado!' });
          }
          if (await User.findOne({ where: { telefone } })) {
              return res.status(400).json({ success: false, message: 'Telefone já cadastrado!' });
          }

          // 🔑 Hash da senha
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(senha, salt);

          // ✅ Criar usuário no banco
          const user = await User.create({ nome, email, telefone, senha: hashedPassword });

          // 🔑 Gerar token JWT
          const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

          res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!', token });

      } catch (error) {
          console.error('❌ Erro ao cadastrar usuário:', error);
          res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário. Tente novamente!' });
      }
  });


  router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('senha').notEmpty().withMessage('A senha é obrigatória')
  ], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }

        const { email, senha } = req.body;
        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

        if (!user) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
        }

        // 🔑 Gerar token JWT
        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login realizado com sucesso!', token });

    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
  });

  module.exports = router;
