const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5501;

// Configuration de session
app.use(session({
    secret: 'votre_secret', // Remplacez par une clé secrète
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Changez à true en production avec HTTPS
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const messagesRouter = require('./routes/messages');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
