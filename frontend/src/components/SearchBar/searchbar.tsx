import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  };
  return (
    <div className="flex items-center gap-2 absolute top-80 left-1/3 w-full max-w-[32rem]">
      <input
        type="text"
        placeholder="                     SEARCH BY MAKE/MODEL OR ..."
        className="flex-1 p-2 border  shadow-[0_0_10px_6px_rgba(0,0,0,0.4)] rounded-3xl border-gray-300  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-[#0663B2] rounded-tl-3xl rounded-br-3xl  text-white py-2 px-4  cursor-pointer transition-all hover:bg-blue-800"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
