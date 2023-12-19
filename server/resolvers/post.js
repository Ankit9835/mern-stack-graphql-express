const {gql} = require('apollo-server-express')
const {posts} = require('../post')
const { authCheck } = require('../helpers/auth')


const totalPosts = () => posts.length
const allPosts = async (parent, args, { req }) => {
    await authCheck(req);
    return posts;
};

const newPost = (parent,args) => {
    console.log('args',args)
    const post = {
        id: posts.length + 1,
        title: args.input.title,
        description: args.input.description
    }
    posts.push(post)
    return post
}

const postCreate = async (parent, args, { req }) => {
    const user = await authCheck(req)
    const currentUserFromDb = await User.findOne({email: user.email})
    let newPost = new Post({
        ...args.input,
        postedBy: currentUserFromDb._id
    }).save().then((post) => post.populate('postedBy', '_id username'))

    return newPost
}

module.exports = {
    Query: {
        allPosts
    },
    Mutation: {
        postCreate
    }
}