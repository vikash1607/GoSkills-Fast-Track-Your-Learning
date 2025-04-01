const express = require("express");
const { chatBotController } = require("../controllers/ChatBot");

const router = express.Router();

router.post("/", chatBotController);

module.exports = router;
