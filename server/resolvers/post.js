const { gql } = require("apollo-server-express");
const { posts } = require("../post");
const { authCheck } = require("../helpers/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require('mongoose');

const POST_ADDED = 'POST_ADDED'

const allPosts = async (parent, args, { req }) => {
  const currentPage = args.page || 1;
  const perPage = 3;

  return await Post.find({})
      .skip((currentPage - 1) * perPage)
      .populate('postedBy', 'username _id email name')
      .limit(perPage)
      .sort({ createdAt: -1 })
};

const postCreate = async (parent, args, { req, pubsub }) => {
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

  pubsub.publish(POST_ADDED, {postAdded: populatedPost})

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


const postDelete = async (parent,args,{req}) => {
  const currentUser = await authCheck(req)
  const currentUserFromDb = await User.findOne({email: currentUser.email})
  const post = await Post.findOne({_id: args.postId})
  console.log('currentUser', currentUserFromDb._id.toString())
  console.log('post', post.postedBy.toString())
  if(currentUserFromDb._id.toString() !== post.postedBy.toString()){
    throw new Error('Unauthorized Access')
  } else {
    let postDelete = await Post.findByIdAndDelete({_id: args.postId})
    return postDelete
  }
}

const singlePostUser = async (parent,args, {req}) => {
  try {
    const currentUser = await authCheck(req)
    const currentUserFromDb = await User.findOne({email: currentUser.email})
    const post = await Post.findById({_id: args.postId})

    if(currentUserFromDb._id.toString() !== post.postedBy._id.toString()){
      throw new Error('Unauthorized Access')
    } else {
      const singlePost = await Post.findById({_id: args.postId}).populate("postedBy", "username name email")
      .sort({ createdAt: -1 });
      return singlePost
    }
  } catch (error) {
    console.log(error)
  }
}

const totalPost = async (parent,args, {req}) => {
  try {
    const post = await Post.find({}).countDocuments()
    return post
  } catch (error) {
    console.log(error)    
  }
}

module.exports = {
  Query: {
    allPosts,
    postByUser,
    singlePostUser,
    totalPost
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete
  },
  Subscription: {
    postAdded: {
      subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator([POST_ADDED])
    }
  }
};
