const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: { // ✅ Mudado para "nome" para ser compatível com o banco
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome não pode estar vazio." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Este e-mail já está cadastrado." }, // 🔥 Corrigido
    validate: {
      isEmail: { msg: "Digite um email válido." },
      notEmpty: { msg: "O email não pode estar vazio." }
    }
  },
  senha: { // ✅ Mudado para "senha" para ser compatível com o banco
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "A senha não pode estar vazia." },
      len: { args: [6, 100], msg: "A senha deve ter pelo menos 6 caracteres." }
    }
  }
}, {
  hooks: {
    // Antes de criar um usuário, criptografa a senha
    beforeCreate: async (user) => {
      if (user.senha) {
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    },
    // Antes de atualizar a senha, criptografa novamente
    beforeUpdate: async (user) => {
      if (user.changed("senha")) {
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    }
  },
  tableName: 'users', // ✅ Garante que a tabela seja chamada corretamente
  timestamps: true // ✅ Mantém createdAt e updatedAt automaticamente
});

// **Método para comparar senhas**
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.senha) return false; // 🔥 Evita erro caso a senha não exista
  return await bcrypt.compare(candidatePassword, this.senha);
};

module.exports = User;
