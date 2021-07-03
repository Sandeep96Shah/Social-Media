//acquiring the express library
const express = require("express");

//acquiring the functionality of express.Router
const router = express.Router();
//acquiring the controller
const homeController = require("../controllers/home_controller");

console.log("index Router is called");

router.get("/", homeController.home);
router.use("/user", require("./user"));
router.use("/posts", require("./post"));
router.use("/comments", require("./comments"));
router.use('/likes',require('./likes'));

//telling the router about the api
router.use('/api',require('./api'));

//exporting the current module
module.exports = router;
