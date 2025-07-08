// src/context/ResponsiveContext.js
import React, { createContext, useContext } from 'react';
import useWindowWidth from '../hooks/useWindowWidth';

const ResponsiveContext = createContext();

export function ResponsiveProvider({ children }) {
  const width = useWindowWidth();

  // Define breakpoints here
  const breakpoints = {
    small: 360,
    medium: 390,
    large: 430,
    xlarge: 480,
  };

  const deviceSize = (() => {
    if (width <= breakpoints.small) return 'small';
    if (width <= breakpoints.medium) return 'medium';
    if (width <= breakpoints.large) return 'large';
    return 'xlarge';
  })();

  return (
    <ResponsiveContext.Provider value={{ width, deviceSize }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  return useContext(ResponsiveContext);
}