// ✅ Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const sequelize = require('./config/database');

// ✅ Importar rotas
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const appointmentRoutes = require('./routes/appointments');
const viewRoutes = require('./routes/viewsRoutes');
const cadastroRoutes = require('./routes/cadastro');

const app = express();

// ✅ Configurar Handlebars como motor de visualização
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware CORS (permitir requisições de origens diferentes)
app.use(cors());

// ✅ Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_super_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// ✅ Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Rotas de autenticação (agora `/login` funciona corretamente)
app.use(authRoutes);

// ✅ Rotas API protegidas (autenticação necessária)
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Rotas públicas (Cadastro e Views)
app.use(cadastroRoutes);
//app.use('/cadastro', cadastroRoutes);
app.use('/', viewRoutes);

// ✅ Middleware de erro (tratamento de erros globais)
app.use((err, req, res, next) => {
  console.error('🚨 Erro detectado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor. Tente novamente mais tarde.'
  });
});

// ✅ Função para iniciar o servidor
async function startServer() {
    try {
        await sequelize.sync({ alter: true }); // ⚠️ Atualiza tabelas sem perder dados
        console.log('✅ Banco de dados sincronizado!');
        
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`🚀 Servidor rodando http://localhost:${PORT}`));
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
    }
}

startServer();
