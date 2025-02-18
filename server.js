// ✅ Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const sequelize = require('./config/database');

// ✅ Importar Middlewares
const authMiddleware = require('./middleware/auth');

// ✅ Criar o app Express
const app = express();

// ✅ Configuração do Handlebars como motor de visualização
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware CORS (permite requisições externas)
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
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// ✅ Importar e usar rotas corretamente
const authRoutes = require('./routes/auth'); // Importação corrigida
const clientRoutes = require('./routes/clients');
const appointmentRoutes = require('./routes/appointments');
const viewRoutes = require('./routes/viewsRoutes');
const cadastroRoutes = require('./routes/cadastro');
const horariosRoutes = require("./routes/horariosRoutes");

app.use('/api/auth', authRoutes); // Agora corretamente configurado
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/cadastro', cadastroRoutes);
app.use('/api/horarios', horariosRoutes); // Corrigida a rota para incluir `/api/`

app.use('/', viewRoutes); // Home e outras views

// ✅ Middleware para tratar erros 404 (rota não encontrada)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// ✅ Middleware de erro global (tratamento de erros inesperados)
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
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    
    await sequelize.sync({ alter: true }); // ⚠️ Atualiza tabelas sem perder dados
    console.log('✅ Banco de dados sincronizado!');
    
    const PORT = process.env.PORT || 4000;

    // Verifica se a porta já está em uso antes de iniciar o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Erro: A porta ${PORT} já está em uso. Escolha outra porta.`);
      } else {
        console.error('❌ Erro ao iniciar o servidor:', err);
      }
    });

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
  }
}

// ✅ Iniciar o servidor
startServer();
