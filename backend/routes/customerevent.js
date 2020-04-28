const express = require("express");
const router = express.Router();
const EventController = require("../controllers/customerevent");
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, EventController.createEvent);

router.put("/:id",checkAuth, EventController.updateEvent );

router.delete("/:id",checkAuth, EventController.deleteEvent);

router.get("/:id",EventController.getEvent);

module.exports = router;
