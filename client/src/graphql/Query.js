import { gql } from "apollo-boost";

export const PROFILE = gql`
  query {
    profile {
      _id
      name
      username
      email
      images {
        url
        public_id
      }
      about
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_USERS = gql`
  {
    allUsers {
      _id
      name
      username
      email
      images {
        url
        public_id
      }
      about
      createdAt
      updatedAt
    }
  }
`;

export const POST_BY_USER = gql`
  {
    postByUser {
      _id
      content
      image {
        public_id
      }
      postedBy {
        name
        username
      }
    }
  }
`;

export const SINGLE_POST = gql`
  query singlePostUser($postId: String!) {
    singlePostUser(postId: $postId) {
      _id
      content
      image{
        url
        public_id
      }
      postedBy{
        username
        name 
        email
      }
    }
  }
`


