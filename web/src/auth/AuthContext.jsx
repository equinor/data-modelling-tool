import React from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({idToken, children}) => {
  let initialState = idToken
  if(!initialState){
    initialState = {
      user: "Not Logged in",
      profile: {
        name: "Not Authenticated"
      }
    }
  }
  return (
    <AuthContext.Provider value={initialState}>{children}</AuthContext.Provider>
  );
};

