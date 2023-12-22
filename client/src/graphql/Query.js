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
