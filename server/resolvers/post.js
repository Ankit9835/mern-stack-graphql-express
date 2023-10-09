const {gql} = require('apollo-server-express')
const {posts} = require('../post')

const totalPosts = () => posts.length
const allPosts = () => posts

module.exports = {
    Query: {
        totalPosts,
        allPosts
    }
}