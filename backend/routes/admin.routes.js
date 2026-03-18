const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const {
  getAdminSummary,
  getTopUsers,
} = require('../controllers/admin.controller');

router.get('/summary', authMiddleware, roleMiddleware('ADMIN'), getAdminSummary);
router.get('/top-users', authMiddleware, roleMiddleware('ADMIN'), getTopUsers);

module.exports = router;