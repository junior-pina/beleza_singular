const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Modelo de usuário

// **Cadastro de Usuário**
router.post('/cadastro', [
  body('nome').notEmpty().withMessage('O nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;

    // Verifica se o usuário já existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    // Hash da senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar usuário no banco
    user = await User.create({ 
      name: nome, // ⚠️ Corrigido para `name` pois é assim no modelo
      email, 
      password: hashedPassword // ⚠️ Corrigido para `password`
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// **Login**
router.post('/login', [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').notEmpty().withMessage('A senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Comparação da senha com bcrypt
    const isMatch = await bcrypt.compare(senha, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Inicia a sessão
    req.session.userId = user.id;
    res.json({ message: 'Login realizado com sucesso!', userId: user.id });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;