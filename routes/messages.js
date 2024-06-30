const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simuler une base de données de messages
let messages = [];

// Middleware pour vérifier la connexion
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

// Page de messagerie
router.get('/', requireLogin, (req, res) => {
    res.render('messages', { user: req.session.userId, messages });
});

// Envoi de message
router.post('/', requireLogin, async (req, res) => {
    const { recipient, content } = req.body;

    // Ajouter le message à la base de données simulée
    messages.push({ sender: req.session.userId, recipient, content, timestamp: new Date() });

    // Si le destinataire est ChatGPT, obtenir une réponse
    if (recipient.toLowerCase() === 'chatgpt') {
        const response = await getChatGptResponse(content);
        messages.push({ sender: 'ChatGPT', recipient: req.session.userId, content: response, timestamp: new Date() });
    }

    // Réponse de confirmation
    res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
});

// Fonction asynchrone pour obtenir la réponse de ChatGPT
async function getChatGptResponse(message) {
    try {
        // Appel à une API fictive ou service pour obtenir une réponse de ChatGPT
        const response = await axios.post('http://api.chatgpt.com/response', { message });
        return response.data.response;
    } catch (error) {
        console.error('Erreur lors de l\'appel à ChatGPT:', error.message);
        return 'Désolé, une erreur est survenue.';
    }
}

module.exports = router;
