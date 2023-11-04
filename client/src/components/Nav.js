import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { auth } from "../firebase";
import { getAuth, signOut } from "firebase/auth";


const Nav = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const navigate = useNavigate()

  const logout = () => {
    const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
    // auth().signOut()
    //     .then(() => {
    //         // Dispatch a user logout action if using Redux
    //         dispatch({
    //             type: 'LOGGED_IN_USER',
    //             payload: null
    //         });
    //         // Navigate to the login page
    //         navigate('/login');
    //     })
    //     .catch(error => {
    //         // Handle any signOut errors here
    //         console.error('Sign out error:', error);
    //     });
};


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Navbar
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li>
          {user && (
                        <li className="nav-item">
                            <a onClick={logout}  className="nav-item nav-link">
                                Logout
                            </a>
                        </li>
                    )}
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Nav;
