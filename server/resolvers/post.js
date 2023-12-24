const { gql } = require("apollo-server-express");
const { posts } = require("../post");
const { authCheck } = require("../helpers/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require('mongoose');

const allPosts = async (parent, args, { req }) => {
  const posts = await Post.find({}).populate(
    "postedBy",
    "_id username name email"
  );
  console.log("posts", posts);
  return posts;
};

const postCreate = async (parent, args, { req }) => {
  const user = await authCheck(req);
  const currentUserFromDb = await User.findOne({ email: user.email });
  let newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb._id,
  }).save();

  // await newPost.save();

  // Populate the postedBy field before returning the new post
  const populatedPost = await newPost.populate(
    "postedBy",
    "_id username email name"
  );

  return populatedPost;
};

const postByUser = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({ email: currentUser.email });
  return await Post.find({ postedBy: currentUserFromDb })
    .populate("postedBy", "username name email")
    .sort({ createdAt: -1 });
};

const postUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({ email: currentUser.email });

  const postId = args.input._id; // Assuming args.input._id is the string representation of the ID

  if (mongoose.Types.ObjectId.isValid(postId)) {
    const post = await Post.findOne({ _id: postId });
    if (post) {
      if (currentUserFromDb._id.toString() !== post.postedBy.toString()) {
        throw new Error("Unauthrized access");
      } else {
        let newPost = await Post.findByIdAndUpdate(
          args.input._id,
          { ...args.input },
          { new: true }
        );
        return newPost;
      }
    } else {
      throw new Error("Post not found");
    }
  } else {
    throw new Error("Invalid ObjectId");
  }
};

module.exports = {
  Query: {
    allPosts,
    postByUser,
  },
  Mutation: {
    postCreate,
    postUpdate,
  },
};
