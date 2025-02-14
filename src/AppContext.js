import { createContext } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const getToken = () => {
    // eslint-disable-next-line no-undef
    return localStorage.getItem(TOKEN) || null;
  };

  return (
    <AppContext.Provider value={{ getToken }}>{children}</AppContext.Provider>
  );
};
