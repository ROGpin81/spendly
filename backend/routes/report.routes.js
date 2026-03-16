const express = require('express');
const router = express.Router();

const { getMonthlySummary } = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/monthly-summary', authMiddleware, getMonthlySummary);

module.exports = router;