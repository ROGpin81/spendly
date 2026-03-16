const express = require('express');
const router = express.Router();

const {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
} = require('../controllers/movement.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getMovements);
router.get('/:id', authMiddleware, getMovementById);
router.post('/', authMiddleware, createMovement);
router.put('/:id', authMiddleware, updateMovement);
router.delete('/:id', authMiddleware, deleteMovement);

module.exports = router;