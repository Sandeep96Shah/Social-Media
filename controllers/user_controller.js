const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    console.log("9898", user);
    return res.render("profile", {
      title: "UserProfile",
      profile_user: user,
    });
  });
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("***Multer Error***", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;
        console.log("*&*", req.file);
        if (req.file) {
          console.log("profile pic updated", req.file);
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          //saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        console.log("user is saved", user);
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      console.log("error in update", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorised");
    return res.status(401).send("unauthorized");
  }
};
//syntax to add controller
//module.exports.ActionName = function(req,res){};

//render the signUp page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign-Up",
  });
};
//render the signIn page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  
  return res.render("user_sign_in", {
    title: "Codeial | Sign-In",
  });
};


//get the sign-Up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up");
          return;
        }
        console.log("****", user);
        return res.redirect("/user/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

//sign in and create a session
module.exports.createSession = function (req, res) {
  //steps to authenticate
  //find the user
  //User.findOne({ email: req.body.email }, function (err, user) {
  //  if (err) {
  //    console.log("error in finding user in signing up");
  //    return;
  //  } //handle user found

  //if (user) {
  ////handle password which doesn't match
  //if (user.password != req.body.password) {
  //return res.redirect("back");
  //}
  ////handle session creation
  //res.cookie("user_id", user.id);
  //return res.redirect("/user/profile");
  //} else {
  ////handle when user is not found
  //return res.redirect("back");
  //}
  //});
  console.log("pahuchhhhh gayaaa");
  req.flash("success", "logged in successfully");
  //this is one of the way to do the flash
  //and the other is by using the middleware
  //return res.redirect('/home',{flash: {success:""}})
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "logged out successfully");
  return res.redirect("/");
};
