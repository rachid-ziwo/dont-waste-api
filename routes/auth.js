const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Créer le nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

module.exports = router;