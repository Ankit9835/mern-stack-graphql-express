const {gql} = require('apollo-server-express')


module.exports = gql`
    type Query {
        me: String!
    }
    type User {
        username: String!
        name: String
        email: String!
        images: [Image]
        about: String
    }

    type Image {
        url: String
        public_id: String
    }

    type UserCreateResponse {
        username: String!
        email: String!
    }

    type Mutation {
        userCreate: UserCreateResponse!
    }
`