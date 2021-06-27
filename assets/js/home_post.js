{
  function noty_flash(type, message) {
    new Noty({
      theme: "relax",
      type: type,
      layout: "topRight",
      text: message,
      timeout: 1500,
    }).show();
  }
  //methos to submit the form data for new post using the AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    //console.log("newPostForm*", newPostForm);
    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        //to make the data as json i.e.key -value pair
        data: newPostForm.serialize(),
        success: function (data) {
          //console.log("98989", data.data.posts);
          let newPost = newPostDom(data.data);
          console.log("newPost*", newPost);
          $("#posts-list-container>ul").prepend(newPost);
          noty_flash("success", "Post Created Successfully");
          deletePost($(" .delete-post-button", newPost));
        },
        error: function (error) {
          console.log(error.response.Text);
        },
      });
      
    });
  };
  //method to create a post in DOM
  let newPostDom = function (data) {
    return $(`<li id="post-${data.post._id}">
      <p>
        <small>
          <a class="delete-post-button" href="/posts/destroy/${data.post._id}">X</a>
        </small> ${data.post.content}
        <br />
        <small> ${data.name} </small>
      </p>
      <div class="post-comments">
        <form action="/comments/create" method="POST">
          <input
            type="text"
            name="content"
            placeholder="Type Here To Add comment..."
            required
          />
          <input type="hidden" name="post" value="${data.post._id}" />
          <input type="submit" value="Add Comment" />
        </form>
    
        <div class="post-comments-list">
          <ul id="post-comments-${data.post._id}">
          </ul>
        </div>
      </div>
    </li>
    `);
  };


  // let createComment = function () {
  //   let newCommentForm = $("new-comment-form");
  //   //console.log("newPostForm*", newPostForm);
  //   newCommentForm.submit(function (e) {
  //     e.preventDefault();
  //     $.ajax({
  //       type: "post",
  //       url: "/comments/create",
  //       //to make the data as json i.e.key -value pair
  //       data: newPostForm.serialize(),
  //       success: function (data) {
  //         //console.log("98989", data.data.posts);
  //         let newComment = newCommentDom(data.data);
  //         console.log("newPost*", newComment);
  //         $("post-comments-<%=post._id%>").prepend(newComment);
  //         noty_flash("success", "Comment Created Successfully");
  //         //deletePost($(" .delete-post-button", newComment));
  //       },
  //       error: function (error) {
  //         console.log(error.response.Text);
  //       },
  //     });
      
  //   });
  // };

  // let newCommentDom = function(){
  //   return $()
  // }



  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log(data);
          $(`#post-${data.data.post_id}`).remove();
          noty_flash("success", "Post Deleted Successfully");
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // let deleteComments = function (deleteLink) {
  //   $(deleteLink).click(function (e) {
  //     e.preventDefault();

  //     $.ajax({
  //       type: "get",
  //       url: $(deleteLink).prop("href"),
  //       success: function (data) {
  //         console.log(data.data);
  //         $(`#post-comment-${data.data.comment_id}`).remove();
  //         noty_flash("success", "Comment Deleted Successfully");
  //       },
  //       error: function (error) {
  //         console.log(error.responseText);
  //       },
  //     });
  //   });
  // };

  let deleteOldPosts = function () {
    $.ajax({
      type: "get",
      url: "/home",
      success: function (data) {
        for (post of data.posts) {
          console.log('post.comments',post.comments);
          deletePost($(" .delete-post-button", `li#post-${post._id}`));
          // for (comment of post.comments) {
          //   console.log('comment',comment);
          //   deleteComments(
          //     $(" .post-comment-button", `li#post-comment-${comment._id}`)
          //   );
          // }
        }
      },
    });
  };
  deleteOldPosts();
  createPost();
  //createComment();
}
