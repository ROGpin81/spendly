const express = require('express');
const router = express.Router();

const { getCategoryStats } = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/categories', authMiddleware, getCategoryStats);

module.exports = router;