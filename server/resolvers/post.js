const {gql} = require('apollo-server-express')
const {posts} = require('../post')

const totalPosts = () => posts.length
const allPosts = () => posts

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

module.exports = {
    Query: {
        totalPosts,
        allPosts
    },
    Mutation: {
        newPost
    }
}