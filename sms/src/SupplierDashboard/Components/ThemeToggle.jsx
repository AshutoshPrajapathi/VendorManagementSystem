import React, { useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const toggleMode = () => {
    toggleTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleMode} className="mr-4 focus:outline-none">
      {theme === 'light' ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
    </button>
  );
};

export default ThemeToggle;
