import React, {useState} from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Home from './pages/Home'
import Nav from './components/Nav';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';




const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Nav />
      <Routes>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </ApolloProvider>
  )
}

export default App;
