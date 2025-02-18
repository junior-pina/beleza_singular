// ✅ Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const sequelize = require('./config/database');
const authMiddleware = require('./middleware/auth');


// ✅ Importar rotas
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const appointmentRoutes = require('./routes/appointments');
const viewRoutes = require('./routes/viewsRoutes');
const cadastroRoutes = require('./routes/cadastro'); // Importar cadastro

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
app.use('/api/clients', authMiddleware, clientRoutes);


// ✅ Middleware CORS (permitir requisições de origens diferentes)
app.use(cors());

// ✅ Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// ✅ Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_super_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// ✅ Rotas API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Rota de cadastro
app.use('/cadastro', cadastroRoutes); 

// ✅ Rotas Views (Handlebars)
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
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
    }
}

startServer();
