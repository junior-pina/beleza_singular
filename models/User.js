const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome não pode estar vazio." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Este e-mail já está cadastrado." },
    validate: {
      isEmail: { msg: "Digite um email válido." },
      notEmpty: { msg: "O email não pode estar vazio." }
    }
  },
  telefone: { // 🔥 Adicionado o campo telefone
    type: DataTypes.STRING,
    allowNull: true, // Pode ser opcional
    validate: {
      notEmpty: { msg: "O telefone não pode estar vazio." }
    }
  },
  senha: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "A senha não pode estar vazia." },
      len: { args: [6, 100], msg: "A senha deve ter pelo menos 6 caracteres." }
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.senha) {
        const salt = await bcrypt.genSalt(12);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed("senha")) {
        const salt = await bcrypt.genSalt(12);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    }
  },
  tableName: 'users', 
  timestamps: true 
});

User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.senha) return false; 
  return await bcrypt.compare(candidatePassword, this.senha);
};

module.exports = User;
