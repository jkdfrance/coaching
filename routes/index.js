const axios = require('axios');
const express = require('express');
const router = express.Router();

// Middleware pour vérifier la connexion
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

// Page principale
router.get('/', (req, res) => {
    res.render('index', { user: req.session.userId });
});

// Page des cours
router.get('/courses', requireLogin, (req, res) => {
    res.render('courses');
});

// Simuler une base de données de messages
let messages = [];

// Page de messagerie
router.get('/messages', requireLogin, (req, res) => {
    res.render('messages', { user: req.session.userId, messages });
});

// Envoi de message
router.post('/messages', requireLogin, async (req, res) => {
    const { recipient, content } = req.body;

    // Ajouter le message à la base de données simulée
    messages.push({ sender: req.session.userId, recipient, content, timestamp: new Date() });

    // Si le destinataire est ChatGPT, obtenir une réponse
    if (recipient.toLowerCase() === 'chatgpt') {
        const response = await getChatGptResponse(content);
        messages.push({ sender: 'ChatGPT', recipient: req.session.userId, content: response, timestamp: new Date() });
    }

    res.redirect('/messages');
});

// Fonction pour obtenir une réponse de ChatGPT
async function getChatGptResponse(message) {
    const API_KEY = 'YOUR_API_KEY'; // Remplacez par votre clé API
    const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const data = {
        prompt: message,
        max_tokens: 150,
    };
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching response from ChatGPT:', error);
        return 'Désolé, une erreur est survenue lors de la récupération de la réponse de ChatGPT.';
    }
}

module.exports = router;
