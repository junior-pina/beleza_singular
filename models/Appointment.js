const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente'); // Importação direta do modelo Cliente

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O serviço é obrigatório." }
    }
  },
  date: {
    type: DataTypes.DATEONLY, // Apenas data (YYYY-MM-DD)
    allowNull: false,
    validate: {
      notEmpty: { msg: "A data do agendamento é obrigatória." },
      isDate: { msg: "Formato de data inválido. Use YYYY-MM-DD." }
    }
  },
  time: {
    type: DataTypes.STRING, // Mantemos como STRING para horários flexíveis
    allowNull: false,
    validate: {
      notEmpty: { msg: "O horário do agendamento é obrigatório." }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'appointments', // Nome explícito da tabela
  timestamps: true // Habilita createdAt e updatedAt
});

// Define relacionamento: Um agendamento pertence a um cliente
Appointment.belongsTo(Cliente, {
  foreignKey: {
    name: 'clientId',
    allowNull: false
  },
  onDelete: 'CASCADE', // Se o cliente for removido, os agendamentos também serão
  onUpdate: 'CASCADE'
});

module.exports = Appointment;
