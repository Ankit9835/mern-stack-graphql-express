import React, { useMemo, useState } from 'react'
import {toast} from 'react-toastify'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'

const PROFILE = gql`
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



const Profile = () => {
  const [values,setValues] = useState({
    _id:'',
    name: '',
    email: '',
    username: '',
    images: [],
  })

  const { data } = useQuery(PROFILE);

  return <div className="container p-5">{JSON.stringify(data)}</div>;
}

export default Profile
