import React, {useContext, useState} from 'react'
import ApolloClient from 'apollo-boost'
import {gql} from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { TOTAL_POST } from '../graphql/Query';



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
  const [page,setPage] = useState(1)
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page }
  });
  
  const [ fetchPosts, {data: posts} ] = useLazyQuery(GET_ALL_POSTS);
  const {state,dispatch} = useContext(AuthContext)
  const { data: postCount } = useQuery(TOTAL_POST);
  console.log('data',data)
  console.log('post count', postCount)
  const updateUserName = () => {
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: 'Ankit Sinha'
    });
  };

  const pagination = () => {
    const totalPages = Math.ceil(postCount && postCount.totalPost / 3);
     console.log(totalPages);
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li>
          <a className="page-link" onClick={() => setPage(i)}>
            {i}
          </a>
        </li>
      );
    }
    return pages;
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
                  <Link to={`/post/${p._id}`}>
                    <h4>@{p.postedBy.username}</h4>
                  </Link>
                  
                </div>
                <p className="card-text">{p.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        
      <nav>
        <ul className="pagination justify-content-center">{pagination()}</ul>
      </nav>
        {/* <button className='btn btn-danger' onClick={() => fetchPosts()}>Fetch Data</button>
        <hr />
        {JSON.stringify(posts)} */}
        <hr />
        {JSON.stringify(state.user)}
        <button className='btn btn-danger' onClick={updateUserName}>Update User Name</button>
      </div>
    </div>
  );
}

export default Home;
