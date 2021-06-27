//acquiring the express library
const express = require("express");

//acquiring the express.Router() functionality
const router = express.Router();

//acquiring the passport library for authentication
const passport = require("passport");

const postsController = require("../controllers/post_controller");

router.post("/create", passport.checkAuthentication, postsController.create);

router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postsController.destroy
);

module.exports = router;
