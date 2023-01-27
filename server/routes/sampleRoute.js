const express = require("express");
const router = express.Router();
const controller = require("../controllers/SampleController");

router
    .get("/", controller.getFunction);

module.exports = router;