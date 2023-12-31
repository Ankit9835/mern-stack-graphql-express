import React, { useContext, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Profile from "./pages/auth/Profile";
import Post from "./pages/post/Post";
import PasswordForgot from "./pages/auth/PasswordForgot";
import PublicRoute from "./components/PublicRoute";
import User from "./pages/User";
import SingleUser from "./pages/SingleUser";
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";


function App() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  console.log("user", user);

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache({
      addTypename: false
    }),
    headers: {
      authtoken: user ? user.token : "",
    },
  });
  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={ <PublicRoute>
          <Login />
        </PublicRoute>} />
        <Route path="password/forgot" element={<PasswordForgot />} />
        <Route
          path="/update/password"
          element={
            <PrivateRoute>
              <PasswordUpdate />
            </PrivateRoute>
          }
        />

      <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />


        <Route
          path="/create/posts"
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />

        <Route
          path="/post/update/:postId"
          element={
            <PrivateRoute>
              <PostUpdate />
            </PrivateRoute>
          }
        />


        <Route path="post/:postId" element={<SinglePost />} />

        <Route path="register" element={<PublicRoute>
          <Register />
        </PublicRoute>} />
        <Route
          path="complete-registration"
          element={<CompleteRegistration />}
        />
        <Route
          path="users"
          element={<User />}
        />
         <Route
          path="user/:username"
          element={<SingleUser />}
        />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
