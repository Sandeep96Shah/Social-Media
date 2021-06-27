//acquiring the express library
const express = require("express");

//acquiring the functionality of express.Router
const router = express.Router();

router.use("/posts", require("./posts"));

module.exports = router;
