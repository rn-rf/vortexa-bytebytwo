const router = require('express').Router();
const { signUpValidation, loginValidation } = require('../middlewares/authValidation');
const { signUp, login } = require('../controllers/authController');

router.post('/signup', signUpValidation, signUp);
router.post('/login', loginValidation, login);

module.exports = router;