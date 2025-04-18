import React from 'react';

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <div className="card-container flex flex-wrap gap-5 justify-start p-5 mt-7 max-w-screen-xl mx-auto">
      {children}
    </div>
  );
};

export default CardContainer;
