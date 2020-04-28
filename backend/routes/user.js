const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();

router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.put("/update/:id", UserController.updateUser);

module.exports = router;
