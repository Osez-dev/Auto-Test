import React, { useState } from 'react';

const SearchComponent: React.FC<{ onFilterChange: (option: string) => void }> = ({ onFilterChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>('All');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onFilterChange(option); // Pass the selected option to parent
  };

  return (
    <div className="search-container flex flex-col items-center bg-white rounded-xl p-4 shadow-lg w-96 mx-auto my-4 font-sans text-black h-[100px] justify-center">
      <div className="options flex mb-4">
        {['New', 'Used', 'Rental', 'All'].map((option) => (
          <button
            key={option}
            className={`option-button px-4 py-2 mx-2 rounded-lg font-bold text-white ${
              selectedOption === option ? 'bg-gray-600' : 'bg-blue-600'
            }`}
            onClick={() => handleOptionChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
