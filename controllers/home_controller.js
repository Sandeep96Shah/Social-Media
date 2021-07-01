const { populate } = require("../models/post");
const Post = require("../models/post");

const User = require("../models/user");

module.exports.home = async function (req, res) {
  //console.log(req.cookies);
  //res.cookie("user_id", 202);
  console.log("home_controller is loaded");
  // Post.find({}, function (err, posts) {
  //   if (err) {
  //     console.log("err", err);
  //     return;
  //   }
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts: posts,
  //   });
  // });
  //populating the user of each post
  //using the async await
  // Post.find({})
  //   .populate("user")
  //   .populate({
  //     path: "comments",
  //     populate: {
  //       path: "user",
  //     },
  //   })
  //   .exec(function (err, posts) {
  //     if (err) {
  //       console.log("err", err);
  //       return;
  //     }
  //     User.find({}, function (err, users) {
  //       return res.render("home", {
  //         title: "Codeial | Home",
  //         posts: posts,
  //         all_users: users,
  //       });
  //     });
  //   });

  //using the asyns
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate:{
          path:"Likes"
        }
      }).populate('comments')
      .populate('Likes');


      console.log("checking for populated", posts);
      
      if(req.xhr){
        console.log('send from the xhr');
        return res.status(200).json({
          posts:posts
        })
      }
    let users = await User.find({});
    console.log('send from the home');
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("error", err);
    return;
  }
};

//syntax to add the controller
//module.exports.ControllerName = function(req,res){};
