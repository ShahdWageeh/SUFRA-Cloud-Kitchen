import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-container focus:ring-orange-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
