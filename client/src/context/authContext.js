import React, {useReducer, createContext, useEffect} from 'react'
import { auth } from '../firebase';



const fireBaseReducer = (state,action) => {
    switch(action.type){
        case 'LOGGED_IN_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

const initialState = {
    user: null
}

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(fireBaseReducer, initialState);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if(user){
                const idTokenResult = await user.getIdTokenResult()
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {email: user.email, token: idTokenResult.token} 
                })
            } else {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null 
                })
            }
            
        })
        return () => unsubscribe()
    },[])

    const value = { state, dispatch };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {AuthContext,AuthProvider}
