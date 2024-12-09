const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Obtenir le profil
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le profil
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // On ne met pas à jour le mot de passe ici
    delete updates.email; // On ne permet pas de changer l'email ici

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;