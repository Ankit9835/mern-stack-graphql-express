import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';


const PUBLIC_PROFILE = gql`
    query publicProfileusername($username: String!) {
        publicProfileusername(username: $username) {
            _id
            username
            name
            email
            images {
                url
                public_id
            }
            about
        }
    }
`;
const SingleUser = () => {
    let params = useParams()
    const { loading, data } = useQuery(PUBLIC_PROFILE, {
        variables: { username: params.username }
    });

    if (loading) return <p className="p-5">Loading...</p>;

    return <div className="container"><UserCard user={data.publicProfileusername} /></div>;
};

export default SingleUser;
