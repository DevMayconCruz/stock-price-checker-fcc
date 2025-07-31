dorequire('dotenv').config(); // Carrega as variáveis de ambiente do .env
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors'); // Vamos incluir por enquanto, mas pode ser ajustado.
const apiRoutes = require('./routes/api.js'); // Importa suas rotas

// Configuração do Helmet para segurança, incluindo CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"], // Permite scripts apenas do seu próprio domínio
    styleSrc: ["'self'"], // Permite estilos apenas do seu próprio domínio
    imgSrc: ["'self'", "data:"], // Permite imagens do próprio domínio e dados base64 (muitas vezes necessário)
    connectSrc: ["'self'"], // Crucial para que o frontend possa se conectar à API no mesmo domínio
    formAction: ["'self'"], // Permite submissões de formulário para o próprio domínio
    objectSrc: ["'none'"], // Não permite objetos (Flash, Java applets)
    // Removida: upgradeInsecureRequests, pois pode causar problemas em ambientes HTTP de teste do FCC
  },
}));

// Configuração do CORS (para permitir que o frontend acesse a API, pode precisar de ajustes específicos para produção)
app.use(cors({
  origin: '*', // Permite todas as origens por enquanto. Em produção, você deve restringir isso.
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Se você for lidar com cookies ou autenticação
  optionsSuccessStatus: 204
}));

// Middleware para parsear o corpo das requisições (se for usar POST, PUT, etc.)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirva arquivos estáticos (se você tiver um frontend em HTML, CSS, JS no diretório 'public')
// Por enquanto, vamos criar uma pasta 'public' para o frontend de exemplo no próximo passo.
app.use(express.static('public'));

// Rota de exemplo para verificar se o servidor está funcionando
// Esta rota vai tentar enviar o arquivo index.html da pasta public.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Porta do servidor
apiRoutes(app); // Passa a instância do 'app' para suas rotas
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Ambiente de teste ativo.');
  }
});

module.exports = app; // Exporta o app para uso em testes