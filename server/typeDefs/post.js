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
        postByUser: [Post!]!
    }
    input PostCreateInput {
        content: String!
        image: ImageInput
    }

    input PostUpdateInput {
        _id: String!
        content: String!
        image: ImageInput
    }
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
    }
`