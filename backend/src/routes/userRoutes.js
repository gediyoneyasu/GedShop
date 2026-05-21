const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/authController');

router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
