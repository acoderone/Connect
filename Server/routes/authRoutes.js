const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/checkAuth", authController.checkAuth);
router.post("/logout",authController.logout);
module.exports = router;
