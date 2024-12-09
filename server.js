const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const auth = require('./middleware/auth');
const Order = require('./models/Order');
const User = require('./models/User');

require('dotenv').config();


// Importer les routes d'authentification
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const orderRoutes = require('./routes/orders');

const app = express();
const port = process.env.PORT || 3000;
// Connexion à MongoDB
connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utiliser les routes d'authentification
app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes);
app.use('/api/orders', orderRoutes);
// Test route pour vérifier la connexion
app.get('/test', (req, res) => {
  res.json({ message: "API connectée" });
});

// Vos routes existantes
const categories = [
    { image: '/images/fruits-vegetables.png', name: 'Fruits\nvegetables' },
    { image: '/images/bakery.png', name: 'Bakery' },
    { image: '/images/fast-food.png', name: 'Fast food' },
    { image: '/images/sushi.png', name: 'Sushi' },
];

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.delete('/api/test/cleanup', async (req, res) => {
  try {
    await Promise.all([
      Order.deleteMany({}),
      User.deleteMany({})
    ]);
    res.json({ message: 'Base de données nettoyée' });
  } catch (error) {
    console.error('Erreur cleanup:', error);
    res.status(500).json({ message: 'Erreur lors du nettoyage' });
  }
});

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Route protégée accessible', userId: req.userId });
});




app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});


