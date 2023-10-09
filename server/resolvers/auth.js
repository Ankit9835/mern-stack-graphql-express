const {gql} = require('apollo-server-express')

const me = () => 'Ankit'

module.exports = {
    Query: {
        me
    }
}