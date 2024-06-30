const express = require('express');
const router = express.Router();

// Simuler une base de données de cours
let courses = [];

// Page de liste des cours
router.get('/', (req, res) => {
    res.render('courses', { courses });
});

// Page de création de cours
router.get('/new', (req, res) => {
    res.render('new_course');
});

// Créer un nouveau cours
router.post('/new', (req, res) => {
    const { title, description } = req.body;
    courses.push({ title, description });
    res.redirect('/courses');
});

// Page de détails du cours
router.get('/:id', (req, res) => {
    const course = courses[req.params.id];
    res.render('course_detail', { course });
});

module.exports = router;
