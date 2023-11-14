import React, { useState } from 'react'
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import AuthForm from '../../components/forms/AuthForm';


const Register = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const config = {
                url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
                handleCodeInApp: true,
            };

            await auth.sendSignInLinkToEmail(email, config);

            toast.success(`Email is sent to ${email}. click the link to complete your registration.`);

            // Store the email in local storage for later use
            window.localStorage.setItem('emailForRegistration', email);

            // Clear the form and loading state
            setEmail('');
            setLoading(false);

            // Display a message or redirect the user to a confirmation page
            //alert('A confirmation email has been sent to your email address. Please check your inbox and follow the instructions to complete the registration.');
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            setLoading(false);
        }
    };

   return (
        <div className="contianer p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Register</h4>}
            <AuthForm email={email} loading={loading} setEmail={setEmail} handleSubmit={handleSubmit} />
        </div>
    );
}

export default Register
