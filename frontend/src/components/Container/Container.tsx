import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="box-border max-w-[1300px] overflow-hidden mx-auto flex flex-col items-center justify-start min-h-screen p-5 
                    ">
      {children}
    </div>
  );
};

export default Container;
