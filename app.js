const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 8888;

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

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

    // Insertion des données dans la base de données
    db.query('INSERT INTO contacts SET ?', formData, (err, result) => {
        if (err) {
            res.sendFile(__dirname + '/error.html');
        } else {
            res.sendFile(__dirname + '/success.html');
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});