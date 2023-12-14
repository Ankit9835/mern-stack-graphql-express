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