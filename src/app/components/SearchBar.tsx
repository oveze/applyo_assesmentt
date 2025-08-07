import React from "react";
type SearchProps = { value: string; onChange: (v: string) => void; onSearch: () => void; }
const SearchBar: React.FC<SearchProps> = ({ value, onChange, onSearch }) => (
  <div className="flex mb-4">
    <input
      className="border p-2 mr-2 flex-grow rounded-l"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search movies or series..."
      onKeyDown={e => e.key === "Enter" && onSearch()}
    />
    <button className="bg-blue-600 text-white px-4 rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[20px]   " onClick={onSearch}>Search</button>
  </div>
);
export default SearchBar;

