const {gql} = require('apollo-server-express')


module.exports = gql`
    type Post {
        _id: ID!
        content: String!
        image: Image
        postedBy: User
    }
    type Query {
        allPosts: [Post!]!
    }
    input PostCreateInput {
        content: String!
        image: ImageInput
    }
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
    }
`