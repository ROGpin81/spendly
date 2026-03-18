const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { getMapExpenses } = require('../controllers/map.controller');

router.get('/expenses', authMiddleware, getMapExpenses);

module.exports = router;