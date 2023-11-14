const {gql} = require('apollo-server-express')
const { authCheck } = require('../helpers/auth')
const User = require('../models/User')
const shortid = require('shortid');


const me = async (parent, args, {req,res}) => {
    await authCheck(req)
    return 'Ankit'
}

const userCreateResolver = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    const user = await User.findOne({ email: currentUser.email });

    if (user) {
        return {
            username: user.username,
            email: user.email,
        };
    } else {
        const newUser = new User({
            email: currentUser.email,
            username: shortid.generate(),
        });

        await newUser.save();

        return {
            username: newUser.username,
            email: newUser.email,
        };
    }
};

module.exports = {
    Query: {
        me
    },
    Mutation: {
        userCreate: userCreateResolver
    }
}