import { gql } from "apollo-boost";

export const USER_UPDATE = gql`
  mutation UserUpdate($input: userUpdateInput) {
    userUpdate(input: $input) {
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

export const POST_CREATE = gql`
  mutation postCreate($input: PostCreateInput!){
    postCreate(input: $input){
      _id
      content
      image{
        public_id
      }
      postedBy{
        name
        username
        email
      }
    }
  }
`

export const USER_CREATE = gql`
    mutation userCreate {
        userCreate {
            username
            email
        }
    }
`

export const POST_DELETE = gql`
    mutation postDelete($postId: String){
      postDelete(postId: $postId){
        content
        image{
          public_id
          url
        }
      }
    }
`

export const POST_UPDATE = gql`
    mutation postUpdate($input: PostUpdateInput!){
      postUpdate(input: $input){
        _id
        content
        image{
          public_id
          url
        }
      }
    }
`