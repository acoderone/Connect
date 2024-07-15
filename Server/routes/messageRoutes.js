const express = require("express");
const router = express.Router();
const messageController = require("../Controller/messageController");
const auth = require("../middlewares/auth");

router.get("/:userId", auth, messageController.getMessages);
router.post("/room",auth,)
module.exports = router;
