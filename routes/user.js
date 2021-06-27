//acquiring the express library
const express = require("express");

//acquiring the express.Router() functionality
const router = express.Router();

//acquiring the passport library function
const passport = require("passport");
//acquiring the user_controller
const usersController = require("../controllers/user_controller");

//caling the controller for the specific routes
router.get("/profile/:id", passport.checkAuthentication, usersController.profile);
router.post("/update/:id", passport.checkAuthentication, usersController.update);
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);


router.post("/create", usersController.create);
//use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/user/sign-in" }),
  usersController.createSession
);




//router.post("/create-session", usersController.createSession);

router.get('/sign-out',usersController.destroySession);


router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/user/sign-in'}),usersController.createSession);

//exporting the current file
module.exports = router;
