const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewControllers');

// ✅ Definindo todas as rotas antes de exportar
router.get('/', viewController.renderHome);
router.get('/agendamento', viewController.renderAgendamento);
router.get('/login', viewController.renderLogin);
router.get('/cadastro', (req, res) => {
    res.render('cadastro', {
        title: 'Cadastro | Beleza Singular'
    });
});

// ✅ Exportação do router deve ser a última linha do arquivo
module.exports = router;
