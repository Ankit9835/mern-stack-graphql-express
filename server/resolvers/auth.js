const {gql} = require('apollo-server-express')
const { authCheck } = require('../helpers/auth')
const User = require('../models/User')
const shortid = require('shortid');
const {DateTimeResolver} = require('graphql-scalars')
const { GraphQLUnionType } = require('graphql');


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

const userUpdate = async (parent, args, {req}) => {
    const currentUser = await authCheck(req)
    const userUpdate = await User.findOneAndUpdate({email: currentUser.email}, {
        ...args.input
    }, {new: true})
    return userUpdate
}

const profile = async (parent, args, {req}) => {
    const currentUser = await authCheck(req)
    const user = await User.findOne({email: currentUser.email})
    return user
}


const publicProfileusername = async(parent,args, {req}) => {
    const {username} = args
    const user = await User.findOne({username: username})
    if (user) {
        return user;
      } else {
        return null;
      }
}

const UserResult = (obj, context, info) =>  {
   
      if (obj._id && obj.username) {
        return 'User';
      } else if (obj.message) {
        return 'UserNotFoundError';
      }
      return null;

  }

  const allUsers = async (parent,args) => await User.find() 
  

module.exports = {
    Query: {
        me,
        profile,
        publicProfileusername,
        allUsers
    },
    Mutation: {
        userCreate: userCreateResolver,
        userUpdate
    }
}