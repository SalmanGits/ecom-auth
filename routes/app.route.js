const express = require('express');
const router = express.Router()
const { login,signup, getAllCategories } = require('../controllers/app.controller.js');
const verifyToken = require('../auth/auth.js');
router.post("/signup", signup)
router.post("/login", login)
router.post("/categories",verifyToken,getAllCategories)

module.exports = router