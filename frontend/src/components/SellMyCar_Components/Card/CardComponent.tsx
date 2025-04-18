import React from 'react';

interface CardProps {
  title: string;
  onClick: () => void; // Optional click handler
}

const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return (
    <div className="card relative flex flex-col justify-center items-center w-64 h-64 p-5 bg-blue-600 text-center rounded-lg shadow-md overflow-hidden z-10">
      <div className="absolute inset-0 bg-gradient-radial from-blue-800 to-transparent animate-echo rounded-lg mix-blend-overlay"></div>
      <button onClick={onClick} className="postAdd text-blue-600 bg-white py-2 px-5 rounded-full text-lg cursor-pointer z-20 transition-transform transform duration-300 hover:translate-y-[-5px] hover:shadow-xl">
        {title}
      </button>
    </div>
  );
};

export default Card;
