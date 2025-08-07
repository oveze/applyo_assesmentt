import React from "react";

type SearchProps = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

const SearchBar: React.FC<SearchProps> = ({ value, onChange, onSearch , onClear}) => (
  <div className="flex mb-4 relative w-full max-w-md">
    <input
      className="border p-2 pr-10 flex-grow rounded-l w-full mr-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search movies or series..."
      onKeyDown={e => e.key === "Enter" && onSearch()}
    />

    {/* X button shown only when there is text */}
    {value && (
  <button
    type="button"
    onClick={onClear}
    className="absolute right-28 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black text-lg"
  >
    ✕
  </button>
)}


    <button
      className="bg-blue-600 text-white px-4 rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[20px]"
      onClick={onSearch}
    >
      Search
    </button>
  </div>
);

export default SearchBar;
