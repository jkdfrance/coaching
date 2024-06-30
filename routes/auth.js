const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Simuler une base de données
let users = [];

// Page d'inscription
router.get('/register', (req, res) => {
    res.render('register');
});

// Page de connexion
router.get('/login', (req, res) => {
    res.render('login');
});

// Gestion de l'inscription
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect('/auth/login');
});

// Gestion de la connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.username;
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
});

// Déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
