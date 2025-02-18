exports.renderHome = (req, res) => {
    res.render('index', {
        title: 'Beleza Singular',
        clientes: [
            { nome: 'Maria Silva', foto: '/img/maria.jpg', depoimento: 'Ótimo atendimento!', ano: '2025' },
            { nome: 'João Santos', foto: '/img/joao.jpg', depoimento: 'Equipe muito profissional.', ano: '2021' },
            { nome: 'Ana Paula', foto: '/img/ana.jpg', depoimento: 'Serviço incrível!', ano: '2024' }
        ]
    });
};

exports.renderAgendamento = (req, res) => {
    res.render('agendamento', {
        title: 'Agendamento | Beleza Singular'
    });
};

exports.renderLogin = (req, res) => {
    res.render('login', {
        title: 'Login | Beleza Singular'
    });
};
