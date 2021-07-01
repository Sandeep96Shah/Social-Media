const Comment = require("../models/comment");
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

const Post = require("../models/post");


module.exports.create = async function(req,res){
  try{
    let post = await Post.findById(req.body.post);

    if(post){
      let comment = await Comment.create({
        content:req.body.content,
        post:req.body.post,
        user:req.user._id
      })
      post.comments.push(comment);
      post.save();

      comment = await comment.populate('user','name email').execPopulate();
      // commentsMailer.newComment(comment);
      let job = queue.create("emails",comment).save(function(err){
        if(err){
          console.log('error in seding the email to queue',err);
          return;
        }

        console.log("job enqueued",job.id);
      })
      if(req.xhr){
        return res.status(200).json({
          data:{
            comment:comment,
          },
          message:"Post created"
        })
      }
      req.flash("success", "Commented Successfully");
      res.redirect("/home");
    }
    else {
      return res.redirect("back");
    }
  }
  catch(err){
    req.flash("error", err);
    return res.redirect("back");
  }
}
// module.exports.create = function (req, res) {
//   Post.findById(req.body.post,  function (err, post) {
//     if (post) {
//       Comment.create(
//         {
//           content: req.body.content,
//           post: req.body.post,
//           user: req.user._id,
//         },
//         function (err, comment) {
//           //this is to update the comment in the comments array of post Schema
//           post.comments.push(comment);
//           post.save();
//           // let comment = await Comment.populate('user','name email').execPopulate();
//           // commentsMailer.newComment(comment);
//           if(req.xhr){
//             return res.status(200).json({
//               comment:comment
//             })
//           }
//           req.flash("success", "Commented Successfully");
//           res.redirect("/home");
//         }
//       );
//     }
//   });
// };

module.exports.destroy = async function (req, res) {
  // Comment.findById(req.params.id, function (err, comment) {
  //   if (err) {
  //     console.log("error while deleting the comment from the DB");
  //     return;
  //   }
  //   if (comment) {
  //     if (req.user.id == comment.user) {
  //       let postId = comment.post;
  //       comment.remove();
  //       Post.findByIdAndUpdate(
  //         postId,
  //         { $pull: { comments: req.params.id } },
  //         function (err, post) {
  //           if (err) {
  //             console.log("error while updating the comments of the post");
  //             return;
  //           }
  //           return res.redirect("back");
  //         }
  //       );
  //     } else {
  //       return res.redirect("back");
  //     }
  //   } else {
  //     return res.redirect("back");
  //   }
  // });
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment) {
      if (req.user.id == comment.user) {
        if(req.xhr){
          console.log('deleted comment checked');
          return res.status(200).json({
            comment_id : req.params.id
          })
        }
        let postId = comment.post;
        await comment.remove();
        Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
        //change 
        await Like.destroyMany({likeable:comment._id, onModel:'Comment'});
        req.flash("success", "Comment is Deleted Successfully");
        return res.redirect("back");
      } else {
        req.flash("error", "You are not allowed to delete the comment");
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
