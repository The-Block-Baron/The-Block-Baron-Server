import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 35, 
  message: "Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo más tarde."
});

export default loginLimiter;
