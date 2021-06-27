//acquiring the express library
const express = require("express");

//acquiring the express.Router() functionality
const router = express.Router();

//acquiring the passport library for authentication
const passport = require("passport");

const commentsController = require("../controllers/comments_controller");

router.post("/create", passport.checkAuthentication, commentsController.create);

router.get('/destroy/:id',passport.checkAuthentication,commentsController.destroy);

module.exports = router;
