const express = require("express");
const router = express.Router();
const messageController = require("../Controller/messageController");
const auth = require("../middlewares/auth");

router.get("/:userId", auth, messageController.getMessages);
router.post("/room",auth,messageController.createRoom)
router.get("/room/:roomId",auth,messageController.getRoom);
router.get("/roomMessages/:roomId",auth,messageController.getRoomMessages);
router.post("/enterRoom",auth,messageController.enterRoom);
module.exports = router;
