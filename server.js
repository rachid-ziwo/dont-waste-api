// server.js

const express = require('express');
const bodyParser = require('body-parser');
const os = require("os")

const app = express();
const path = require('path');


const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Données des catégories
const categories = [
    { image: '/images/fruits-vegetables.png', name: 'Fruits\nvegetables' },
    { image: '/images/bakery.png', name: 'Bakery' },
    { image: '/images/fast-food.png', name: 'Fast food' },
    { image: '/images/sushi.png', name: 'Sushi' },
  ];

// Route pour récupérer les catégories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      const interface = interfaces[interfaceName];
      for (const entry of interface) {
        if (entry.family === 'IPv4' && !entry.internal) {
          return entry.address;
        }
      }
    }
    return null;
  }

  console.log("Your local IP address is:", getLocalIpAddress());