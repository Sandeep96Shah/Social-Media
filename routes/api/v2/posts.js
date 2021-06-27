//acquiring the express library
const express = require("express");

//acquiring the functionality of express.Router
const router = express.Router();


const postApi = require('../../../controllers/api/v2/posts_api');

router.get('/',postApi.index);

module.exports = router;