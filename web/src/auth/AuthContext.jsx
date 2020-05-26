import React from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({idToken, children}) => {
  return (
    <AuthContext.Provider value={idToken}>{children}</AuthContext.Provider>
  );
};

