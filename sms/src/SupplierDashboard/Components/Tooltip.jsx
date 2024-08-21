import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute left-full ml-2 hidden group-hover:flex justify-center w-max p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg z-10 border border-white">
        {text}
        <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
