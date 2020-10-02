const express = require('express');
const { protected, isAdmin } = require('../middleware/protectedRoute');
const { loginUser, registerUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', registerUser);

router.post('/login', loginUser);

router.route('/profile').get().put();

router.route('/:id').delete().get().put();

module.exports = router;
