const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getMe,
  updateProfile,
  getUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
