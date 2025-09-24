const { getHomeData, downloadPDF } = require('../controllers/homeController');
const { ensureAuthenticated } = require('../middlewares/requestValidation');

const router = require('express').Router();

router.get('/', ensureAuthenticated, getHomeData)
router.get('/receipt', ensureAuthenticated, downloadPDF)

module.exports = router;