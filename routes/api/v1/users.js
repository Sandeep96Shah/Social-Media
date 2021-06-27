//acquiring the express library
const express = require("express");

//acquiring the functionality of express.Router
const router = express.Router();

const userApi = require('../../../controllers/api/v1/users_api');

router.post('/create-session',userApi.createSession);

module.exports = router;