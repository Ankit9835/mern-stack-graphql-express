import React, {useContext, useState} from 'react'
import ApolloClient from 'apollo-boost'
import {gql} from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_USERS } from '../graphql/Query';
import UserCard from '../components/UserCard';

const User = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);
 
  const {state,dispatch} = useContext(AuthContext)
  console.log('data',data)

  
  

  if(loading) return <p>Loading</p>
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="container">
      <div className="row p-5">
        {data && data.allUsers.map(user => (
           <div className="col-md-4" key={user._id}>
           <UserCard user={user} />
         </div>
        ))}
      </div>
      {/* <div>
        <button className='btn btn-danger' onClick={() => fetchPosts()}>Fetch Data</button>
        <hr />
        {JSON.stringify(posts)}
        <hr />
        {JSON.stringify(state.user)}
        <button className='btn btn-danger' onClick={updateUserName}>Update User Name</button>
      </div> */}
    </div>
  );
}

export default User;
