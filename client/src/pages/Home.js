import React, {useContext, useState} from 'react'
import ApolloClient from 'apollo-boost'
import {gql} from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';



const GET_ALL_POSTS = gql`
{
    allPosts {
      _id
      content
      image{
        url
        public_id
      }
      postedBy{
        name
        username
      }
    }
  }
`

const Home = () => {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);
  const [ fetchPosts, {data: posts} ] = useLazyQuery(GET_ALL_POSTS);
  const {state,dispatch} = useContext(AuthContext)
  console.log('data',data)

  const updateUserName = () => {
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: 'Ankit Sinha'
    });
  };

  

  if(loading) return <p>Loading</p>
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="container">
      <div className="row p-5">
        {data && data.allPosts.map(p => (
          <div className="col-md-4" key={p._id}>
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h4>@{p.postedBy.username}</h4>
                </div>
                <p className="card-text">{p.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className='btn btn-danger' onClick={() => fetchPosts()}>Fetch Data</button>
        <hr />
        {JSON.stringify(posts)}
        <hr />
        {JSON.stringify(state.user)}
        <button className='btn btn-danger' onClick={updateUserName}>Update User Name</button>
      </div>
    </div>
  );
}

export default Home;
