const {gql} = require('apollo-server-express')


module.exports = gql`
    scalar DataTime
    type Query {
        me: String!
        profile: User!
    }
    type User {
        _id: ID
        username: String
        name: String
        email: String!
        images: [Image]
        about: String
        createdAt: DataTime
        updatedAt: DataTime
    }

    type Image {
        url: String
        public_id: String
    }

    input ImageInput {
        url: String
        public_id: String
    }

    input userUpdateInput {
        _id: ID
        username: String
        name: String
        email: String
        images: [ImageInput]
        about: String
    }

    type UserCreateResponse {
        username: String!
        email: String!
    }

    type Mutation {
        userCreate: UserCreateResponse!
        userUpdate(input: userUpdateInput): User!
    }
`