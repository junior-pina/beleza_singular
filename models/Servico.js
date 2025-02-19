const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: false });

module.exports = Servico;
