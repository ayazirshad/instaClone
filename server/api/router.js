const express = require("express");
const Post = require("../schema/postSchema");
const Comment = require("../schema/commentSchema");
const User = require("../schema/userSchema");
const router = express.Router();

//_______________ POSTS ______________

// create post

router.post("/post/create", async (req, res) => {
  try {
    const { user, image, caption } = req.body;
    const newPost = new Post({
      user,
      image,
      caption,
      likes: [],
      comments: [],
    });

    const createdPost = await newPost.save();
    const userWithCreatedPost = await User.findByIdAndUpdate(
      user,
      {
        $push: { posts: createdPost },
      },
      { new: true }
    );

    console.log(createdPost);
    console.log("userWithCreatedPost", userWithCreatedPost);
    res.status(201).json({
      msg: "post created",
      post: createdPost,
      user: userWithCreatedPost,
    });
  } catch (e) {
    res.status(500), json({ msg: "internal server error", error: e });
  }
});

// get posts of specific user

router.get("/post/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Post.find({ user: userId }).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    //   .populate({ path: "likes", model: "User" });
    // console.log(data);
    res.status(201).json({ msg: "sending posts", posts: data });
  } catch (e) {
    // console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get all posts

router.get("/post", async (req, res) => {
  try {
    // console.log("get attempt");
    const data = await Post.find().populate([
      { path: "user" },
      {
        path: "comments",
        model: "Comment",
        populate: { path: "user", model: "User" },
      },
      { path: "likes", model: "User" },
    ]);
    // console.log(data[0].user.username);
    // console.log(data);
    res.status(201).json({ msg: "sending posts", posts: data });
  } catch (e) {
    // console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get specific post

router.get("/post/:id/postId", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("get attempt");
    const data = await Post.findById(id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    // console.log(data[0].user.username);
    console.log("personal post", data);
    if (data) {
      res.status(201).json(data);
    } else {
      res.status(204).json({ msg: "post not found" });
    }
  } catch (e) {
    // console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// delete post

router.delete("/post/:postId/delete", async (req, res) => {
  try {
    const _id = req.params.postId;
    console.log(_id);
    // const { userId } = req.body;
    const deletedPost = await Post.findByIdAndDelete(_id);
    // console.log("deletedPost", deletedPost);
    if (deletedPost) {
      const userWithDeletedPost = await User.findByIdAndUpdate(
        deletedPost.user,
        { $pull: { posts: _id } },
        { new: true }
      ).populate([
        { path: "followers", model: "User" },
        { path: "following", model: "User" },
        { path: "posts", model: "Post" },
      ]);
      await Comment.deleteMany({ post: _id });
      res.status(201).json({ msg: "post deleted" });
    } else {
      res.status(200).json({ msg: "post not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// like post

router.put("/post/:postId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const likedPost = await Post.findById(updatedPost._id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    if (likedPost) {
      res.status(201).json(likedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// unlike post

router.put("/post/:postId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    const unLikedPost = await Post.findById(updatedPost._id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    // console.log("updatedPost", updatedPost);
    if (unLikedPost) {
      res.status(201).json(unLikedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// comment

router.put("/post/:postId/comment", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById({ _id: postId });
    // console.log(post);
    // console.log("comment data", req.body);
    if (post) {
      const { userId, text, createdAt } = req.body;
      // console.log(userId, text, createdAt);
      const comment = new Comment({
        user: userId,
        post: postId,
        text,
        createdAt,
      });
      // console.log("commentToBePosted", comment);
      const newComment = await comment.save();
      // console.log("comment", newComment);
      const commentedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: newComment },
        },
        { new: true }
      ).populate([
        { path: "user" },
        { path: "comments", model: "Comment" },
        { path: "likes", model: "User" },
      ]);
      // console.log("commentedPost", commentedPost);
      res.status(201).json(commentedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// delete Comment

router.put("/post/:postId/deleteComment", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { commentId } = req.body;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    // console.log("deletedComment", deletedComment);
    if (deletedComment === null) {
      res.status(200).json({ msg: "comment not found" });
    } else {
      const postToBe = await Post.findById(postId);
      const commentDeletedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: commentId },
        },
        { new: true }
      ).populate([
        { path: "user" },
        { path: "comments", model: "Comment" },
        { path: "likes", model: "User" },
      ]);
      console.log(commentDeletedPost);
      // console.log(postToBe);
      res.status(201).json(commentDeletedPost);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//_______________ USERS ______________

// create user

router.post("/user/create", async (req, res) => {
  try {
    const { username, email, password, profilePicture } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      profilePicture,
      posts: [],
      followers: [],
      following: [],
    });

    const createdUser = await newUser.save();
    console.log("createdUser", createdUser);
    res.status(201).json({ msg: "user registered", user: createdUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// update user account

router.put("/user/:userId/update", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, name, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio },
      { new: true }
    );
    console.log(updatedUser);
    res.status(201).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// follow

router.put("/user/:userId/follow", async (req, res) => {
  try {
    // console.log("fllow attempt");
    const userId = req.params.userId;
    // console.log(userId);
    // console.log(req.body);
    const { userToBeFollowed } = req.body;

    const userFollowing = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: userToBeFollowed },
      },
      { new: true }
    ).populate([
      { path: "followers", model: "User" },
      { path: "following", model: "User" },
      { path: "posts", model: "Post" },
    ]);
    // const userFollowing = await User.find({ _id: following._id })
    console.log("userFollowing", userFollowing);

    const userFollowed = await User.findByIdAndUpdate(
      userToBeFollowed,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    console.log("userFollowed", userFollowed);

    if (userFollowing && userFollowed) {
      console.log("sending follow followers");
      res.status(200).json({
        msg: "started following",
        followingUser: userFollowing,
        followedUser: userFollowed,
      });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get user by username

router.get("/user/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;
    const userFound = await User.findOne({ username: userName }).populate([
      { path: "posts" },
      { path: "followers" },
      { path: "following" },
    ]);
    if (userFound) {
      res.status(200).json(userFound);
    } else {
      res.status(204).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get all users

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(200).json({ msg: "no registered user" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//get user by id

router.get("/user/:userId/userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(userId);
    const userFound = await User.findById(userId).populate([
      { path: "posts" },
      { path: "followers" },
      { path: "following" },
    ]);
    // console.log("userFound", userFound);
    if (userFound) {
      res.status(201).json(userFound);
    } else {
      res.status(204).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// user for ssuggestions // TODO , this will be reviews latter

router.get("/user/:userLoggedIn/suggestions", async (req, res) => {
  try {
    const loggedInUser = req.params.userLoggedIn;
    const foundUsers = await User.find({ username: { $ne: loggedInUser } });
    const logInUser = await User.findOne({ username: loggedInUser });
    const followingIds = logInUser.following.map((user) => user._id);
    // console.log("followingIds", followingIds);
    const users = foundUsers.filter(
      (item) =>
        !followingIds.some((id) => id.toString() === item._id.toString())
    );
    // console.log("users", users);
    if (users) {
      res.status(200).json({ msg: "Users found", suggestedUsers: users });
    } else {
      res.status(204).json({ msg: "Users not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// unfollow

router.put("/user/:userId/unfollow", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userToBeUnfollowed } = req.body;

    const userUnfollowing = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: userToBeUnfollowed },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    const userUnfollowed = await User.findByIdAndUpdate(
      userToBeUnfollowed,
      {
        $pull: { followers: userId },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    if (userUnfollowing && userUnfollowed) {
      res.status(200).json({
        msg: "unfollowed",
        unFollowingUser: userUnfollowing,
        unFollowedUser: userUnfollowed,
      });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// delete account of user

router.delete("/user/:userId/delete", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      await Post.deleteMany({ user: userId });
      await Comment.deleteMany({ user: userId });
      //TODO delete user from followers and following lists of every user
      res.status(201).json({ msg: "user deleted" });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//_______________ COMMENTS ______________

// get comment by post id

router.get("/comment/:postId/postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const foundCommment = await Comment.findOne({ post: postId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get comment by user id

router.get("/comment/:userId/userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundCommment = await Comment.findOne({ user: userId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get comment by comment id

router.get("/comment/:commentId/commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const foundCommment = await Comment.findOne({ _id: commentId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// delete comment

router.delete("/comment/:commentId/delete", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const isCommentFound = await Comment.findById(commentId);
    if (isCommentFound) {
      await Comment.deleteOne({ _id: commentId });
      res.status(201).json({ msg: "Comment deleted" });
    } else {
      res.status(204).json({ msg: "Comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// _____________DEFAULT ERROR ROUTE_____________________

router.get("*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.get("/post/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.get("/post/:userId/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});

router.post("*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.post("/post/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.post("/post/create/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.post("/user/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.post("/user/create/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});

router.put("*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.put("/user/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.put("/user/:userId/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.put("/post/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.put("/post/:postId/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});

router.delete("*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/post/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/post/:postId/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/post/:postId/delete*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/user/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/user/:postId/*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});
router.delete("/user/:postId/delete*", (req, res) => {
  res.status(404).json({ msg: "Error 404! page not found" });
});

module.exports = router;
