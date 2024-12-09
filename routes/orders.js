const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Créer une commande
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      user: req.userId,
      ...req.body
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
});

// Obtenir toutes les commandes de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});
  // Historique des commandes avec filtrage
  // Route pour l'historique
  router.get('/history', auth, async (req, res) => {
    console.log("TEST")
    try {
      const { status } = req.query;
      console.log('Recherche de commandes avec:', {
        userId: req.userId,
        status: status
      });
  
      let query = { user: req.userId };
      if (status) {
        query.status = status;
      }
  
      const orders = await Order.find(query);
      console.log('Commandes trouvées:', orders);
      res.json(orders);
  
    } catch (error) {
      console.error('Erreur historique:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
    }
  });
// Obtenir une commande spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

// Annuler une commande
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.userId, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(400).json({ message: 'Impossible d\'annuler cette commande' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande' });
  }
});

// Mise à jour du statut (pour les restaurants)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    console.log('ID reçu:', req.params.id); // Ajoutons des logs
    console.log('Status reçu:', status);
    
    const order = await Order.findOne({ _id: req.params.id });
    console.log('Commande trouvée:', order); // Pour voir si on trouve la commande

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Erreur mise à jour status:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
});

  
  // Ajouter une évaluation à une commande
  router.post('/:id/review', auth, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const order = await Order.findOneAndUpdate(
        { 
          _id: req.params.id, 
          user: req.userId,
          status: 'completed'  // On ne peut évaluer que les commandes terminées
        },
        {
          review: { rating, comment, createdAt: Date.now() }
        },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée ou non terminée' });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'évaluation' });
    }
  });

module.exports = router;