const express = require('express');
const { protected, isAdmin } = require('../middleware/authMiddleware');
const {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require('../controllers/userController');

const router = express.Router();

router.post('/', registerUser);
router.get('/', protected, isAdmin, getUsers);

router.post('/login', loginUser);

router
  .route('/profile')
  .get(protected, getUserProfile)
  .put(protected, updateUserProfile);

router.route('/:id').delete().get().put();

module.exports = router;
