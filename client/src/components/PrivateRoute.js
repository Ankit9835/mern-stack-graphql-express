import React, { useContext, useState, useEffect } from 'react';
import { Route,Routes, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';


const PrivateRoute = ({ children, ...rest }) => {
    const { state } = useContext(AuthContext);
    const [user, setUser] = useState(false);
    console.log('userss',user)
    // const [user, setUser] = useState(false);

    useEffect(() => {
        if (state.user) {
            setUser(true);
        }
    }, [state.user]);

    const navLinks = () => (
        <nav>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                        Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/update/password">
                        Password
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/create/posts">
                        Post
                    </Link>
                </li>
            </ul>
        </nav>
    );

    const renderContent = () => (
        <div className="container-fluid pt-5">
            <div className="row">
                <div className="col-md-4">{navLinks()}</div>
                <div className="col-md-8">
                    {/* <Routes>
                        <Route {...rest} />
                    </Routes> */}
                    {children}
                    
                </div>
            </div>
        </div>
    );

    return user ? renderContent() : <h4>Loading...</h4>;
};

export default PrivateRoute;
