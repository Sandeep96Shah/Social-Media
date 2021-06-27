const Post = require("../models/post");

const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    async function (err, post) {
      if (err) {
        req.flash("error", err);
        return;
      }
      //req.flash("success", "Post Published Successfully");
      if (req.xhr) {
        let post_detail = await Post.findById(post._id).populate("user");
        // console.log("*&*post", post);
        // console.log("*&*user.name",post_detail.user.name);
        let posts = await Post.find({});
        return res.status(200).json({
          data: {
            posts: posts,
            post: post,
            name: post_detail.user.name,
            //msg: req.flash("success", "Post Created Successfully"),
          },
          message: "Post Created",
        });
      }
      req.flash("success", "Post Published Successfully");
      return res.redirect("back");
    }
  );
};

module.exports.destroy = async function (req, res) {
  console.log("checking the req.params.id", req.params.id.user);
  // Post.findById(req.params.id, function (err, post) {
  //   if (err) {
  //     console.log("error while deleting the post");
  //     return;
  //   }
  //   if (post) {
  //     if (post.user == req.user.id) {
  //       post.remove();
  //       Comment.deleteMany({ post: req.params.id }, function (err) {
  //         if (err) {
  //           console.log(
  //             "error while deleting the comments related to the post"
  //           );
  //           return;
  //         }
  //         return res.redirect("back");
  //       });
  //     }
  //   } else {
  //     return res.redirect("back");
  //   }
  // });
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      if (post.user == req.user.id) {
        post.remove();
        await Comment.deleteMany({ post: req.params.id });
        if (req.xhr) {
          let posts = await Post.find({});
          return res.status(200).json({
            data: {
              posts: posts,
              post_id: req.params.id,
            },
            message: "post deleted",
          });
        }
        req.flash("success", "Post and related comments are Deleted");
        return res.redirect("back");
      } else {
        req.flash("error", "You Cannot Delete the post");
        return res.redirect("back");
      }
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
