const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 8888;

// Configuration de la session (express session)
app.use(session({
    secret: 'asezqsrs%&AB254yyy',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Error while connecting...', err);
        throw err;
    }
    console.log('Connected to database');
});


//express static pour servir les fichier statics
app.use(express.static('/', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));


// middleware CORS pour permettre les requêtes cross-origin
app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: false }));

// Route pour servir le formulaire HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route pour gérer les soumissions de formulaire
app.post('/submit', (req, res) => {
    const { name, email, num, message } = req.body;
    const formData = { name, email, num, message };

    // Stockage des données dans la session (session express)
    req.session.formData = formData;

    // Insertion des données dans la base de données
    db.query('INSERT INTO contacts SET ?', formData, (err, result) => {
        if (err) {
            res.sendFile(__dirname + '/error.html');
        } else {
            res.sendFile(__dirname + '/success.html');
        }
    });
});

// Route pour afficher les données du formulaire sur une autre page
app.get('/display', (req, res) => {
    const formData = req.session.formData;
    res.sendFile(__dirname + '/display.html');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});