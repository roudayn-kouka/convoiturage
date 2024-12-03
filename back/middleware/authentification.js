/* 
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {//C'est une fonction middleware asynchrone qui sera utilisée pour vérifier l'authentification avant de permettre l'accès à certaines routes.
  // check header
  const authHeader = req.headers.authorization//accède à l'en-tête Authorization de la requête HTTP
  console.log('Authorization Header:', authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer')) {///Si l'en-tête Authorization n'est pas présent ou s'il ne commence pas par Bearer ,on lève une erreur d'authentification 
    console.log('En-tête Authorization invalide ou manquant')
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]//split(' ') pour séparer Bearer du token réel et on récupère la deuxième partie (le token).

  /*try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)//jwt.verify déchiffre le token en utilisant le secret (process.env.JWT_SECRET)./ payload fiha : info tq name/id 
    console.log('Payload:', payload)
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name }//Si le token est valide, payload contient les données codées dans le token (comme userId et name).
    next()//Une fonction qui passe au middleware suivant si l'authentification est réussie
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')//Si le token est invalide ou expiré--> une erreur sera levée et capturée par le bloc catch.
  }
}*/
/*try {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Payload:', payload);
  req.user = { userId: payload.userId, name: payload.name }
  next()
} catch (error) {
  if (error.name === 'TokenExpiredError') {
      throw new UnauthenticatedError('Token has expired');
  } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthenticatedError('Invalid token');
  } else {
      throw new UnauthenticatedError('Authentication failed');
  }
}}

module.exports = auth */
const jwt = require('jsonwebtoken');
const { UnauthenticatedError, ForbiddenError } = require('../errors');

const auth = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Payload:', payload);

      // Ajouter l'utilisateur dans la requête
      req.user = { userId: payload.userId, name: payload.name, role: payload.role };

      // Vérification des rôles si spécifié
      if (roles.length > 0 && !roles.includes(payload.role)) {
        throw new ForbiddenError('Access denied');
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthenticatedError('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthenticatedError('Invalid token');
      } else {
        throw new UnauthenticatedError('Authentication failed');
      }
    }
  };
};

module.exports = auth;
