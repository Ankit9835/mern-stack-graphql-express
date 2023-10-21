import React, {useReducer, createContext} from 'react'


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

    const value = { state, dispatch };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {AuthContext,AuthProvider}
