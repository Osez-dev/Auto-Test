/* AdSpace.tsx */
import React from 'react';

interface AdSpaceProps {
  width?: string;
  height?: string;
  adContent?: React.ReactNode;
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  width = '250px', 
  height = '720px', 
  adContent, 
  className 
}) => {
  return (
    <div
      className={`flex   justify-center items-center bg-gray-100 text-center text-sm text-gray-600 border border-gray-300 rounded-xl shadow-lg    ${className || ''}`}
      style={{ width, height }}
    >
      {adContent ? adContent : 'Ad Space'}
    </div>
  );
};

export default AdSpace;
