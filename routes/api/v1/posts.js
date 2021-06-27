//acquiring the express library
const express = require("express");
const passport = require("passport");
//acquiring the functionality of express.Router
const router = express.Router();

const postApi = require("../../../controllers/api/v1/posts_api");

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postApi.destroy
);
router.get("/", postApi.index);

module.exports = router;
