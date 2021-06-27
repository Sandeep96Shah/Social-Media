//adding the express library
const express = require("express");

//adding the cookieParser
const cookieParser = require("cookie-parser");
//port
const port = 8000;

//adding all the functionlaity of express in app
const app = express();

//acquiring the express ejs layouts
const expressLayouts = require("express-ejs-layouts");

//acquring the database:: mongodb through mongose
const db = require("./config/mongoose");

//used for cookie and authentication
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-auth2-strategy');
const MongoStore = require("connect-mongo")(session);

//acquiring the flash library
const flash = require("connect-flash");
//sass
const sassMiddleware = require("node-sass-middleware");

const customMware = require("./config/middleware");

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

//using the middleWare Parser
app.use(express.urlencoded());

//using the cookieParser
app.use(cookieParser());
//using the express ejs layouts
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//using the static file for beautification of the page
app.use(express.static("./assets"));
//make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disable",
      },
      function (err) {
        console.log(err || "connect-mongoDB setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//app.use(passport.checkAuthentication);

app.use(flash());
app.use(customMware.setFlash);

//middleware to the routes
app.use("/", require("./routes"));

//creating the server
app.listen(port, function (err) {
  if (err) {
    console.log(`opps!!! error while running on port: ${port}`);
    return;
  }
  console.log(`yupp!, its running on port: ${port}`);
});
