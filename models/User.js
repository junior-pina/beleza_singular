const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome não pode estar vazio." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // ✅ Unique deve ser declarado assim
    validate: {
      isEmail: { msg: "Digite um email válido." },
      notEmpty: { msg: "O email não pode estar vazio." }
    }
  },
  password: {
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
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  tableName: 'users', // ✅ Garante que a tabela seja chamada corretamente
  timestamps: true // ✅ Mantém createdAt e updatedAt
});

// **Método para comparar senhas**
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // 🔥 Evita erro caso a senha não exista
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
