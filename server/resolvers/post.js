const {gql} = require('apollo-server-express')
const {posts} = require('../post')
const { authCheck } = require('../helpers/auth')
const User = require('../models/User')
const Post = require('../models/Post')


const allPosts = async (parent, args, { req }) => {
    
    const posts = await Post.find({}).populate('postedBy', '_id username name')
    console.log('posts',posts)
    return posts
};


const postCreate = async (parent, args, { req }) => {
    const user = await authCheck(req)
    const currentUserFromDb = await User.findOne({email: user.email})
    let newPost = new Post({
        ...args.input,
        postedBy: currentUserFromDb._id
    }).save()

    await newPost.save();

    // Populate the postedBy field before returning the new post
    const populatedPost = await newPost
        .populate('postedBy', '_id username')
        .execPopulate();

    return populatedPost;
}

module.exports = {
    Query: {
        allPosts
    },
    Mutation: {
        postCreate
    }
}