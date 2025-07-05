const express = require('express');
const { requestReset, resetPassword } = require('../controllers/resetController');
const router = express.Router();

router.post('/request-password-reset', requestReset);
router.post('/reset-password', resetPassword);

module.exports = router;
