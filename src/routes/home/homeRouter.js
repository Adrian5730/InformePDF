const express = require('express');
const router = express.Router();
var homeController = require("../../controllers/home/homeController");

router.get('/', homeController.home);

module.exports = router;