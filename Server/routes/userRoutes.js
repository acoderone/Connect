const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const auth = require("../middlewares/auth");

router.get("/", auth, userController.getUsers);
router.get("/:userId", auth, userController.getUserById);

module.exports = router;
