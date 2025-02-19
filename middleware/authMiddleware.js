const jwt = require('jsonwebtoken');

const SECRET_KEY = 'seuSegredoSuperSeguro'; // 🔐 Idealmente, use variáveis de ambiente

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
    }
};
