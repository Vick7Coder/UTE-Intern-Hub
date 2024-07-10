import React from 'react';

const StyledButton = ({ onClick, title, containerStyles }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out ${containerStyles}`}
        >
            {title}
        </button>
    );
};

export default StyledButton;