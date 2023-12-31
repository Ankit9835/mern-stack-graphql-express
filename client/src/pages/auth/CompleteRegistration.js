import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import AuthForm from '../../components/forms/AuthForm';
import { USER_CREATE } from '../../graphql/Mutation';

const CompleteRegistration = () => {
    const {dispatch} = useContext(AuthContext)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'))
    },[])

    const [userCreate] = useMutation(USER_CREATE);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(!email && !password){
            toast.error('Email and password is required')
            return
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            // console.log(result);
            if (result.user.emailVerified) {
                // remove email from local storage
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;
                await user.updatePassword(password);

                // dispatch user with token and email
                const idTokenResult = await user.getIdTokenResult()
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {email: user.email, token: idTokenResult.token} 
                })
                // then redirect
                userCreate()
                navigate('/')
            }
        } catch (error) {
            console.log('register complete error', error.message);
            setLoading(false);
            toast.error(error.message);
        }
    }

    return (
        <div className="contianer p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Complete Your Registration</h4>}
            <AuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleSubmit={handleSubmit}
                showPasswordInput="true"
            />
        </div>
    );
}

export default CompleteRegistration
