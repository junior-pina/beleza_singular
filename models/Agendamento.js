const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Servico = require('./Servico');

const Agendamento = sequelize.define('Agendamento', {
    data: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado'), defaultValue: 'pendente' }
}, { timestamps: true });

Agendamento.belongsTo(Cliente, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
Agendamento.belongsTo(Servico, { foreignKey: 'servicoId', onDelete: 'CASCADE' });

module.exports = Agendamento;
