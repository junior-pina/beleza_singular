const express = require('express');
const router = express.Router();
const Client = require('../models/Cliente');
const auth = require('../middleware/auth');

// Public client registration
router.post('/register', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, phone, password, address } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Check if email already exists
    const existingClient = await Client.findOne({
      where: { email: email }
    });

    if (existingClient) {
      return res.status(400).json({ 
        success: false,
        message: 'Email já cadastrado' 
      });
    }

    // Create new client
    const client = await Client.create({
      name,
      email,
      phone,
      password,
      address
    });

    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }
    });

  } catch (err) {
    console.error('Error in client registration:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao cadastrar cliente'
    });
  }
});

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create client
router.post('/', auth, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.update(req.body);
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/register', async (req, res) => {
  try {
      // Código de cadastro aqui...
  } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


module.exports = router;