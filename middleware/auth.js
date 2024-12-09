const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Vérifier si le header Authorization existe
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ajouter les infos de l'utilisateur à la requête
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = auth;