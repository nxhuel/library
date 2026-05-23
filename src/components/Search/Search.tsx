import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { BookResponseDTO } from "../../api/types/book.types";

interface SearchProps {
  allBooks: BookResponseDTO[];
  onSearch: (results: BookResponseDTO[]) => void;
}

function Search({ allBooks, onSearch }: SearchProps) {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const filtered = allBooks.filter((book) =>
      book.title.toLowerCase().includes(input.toLowerCase()) ||
      book.authorName.toLowerCase().includes(input.toLowerCase()) ||
      book.gender.toLowerCase().includes(input.toLowerCase())
    );
    onSearch(filtered);
  }, [input, allBooks, onSearch]);

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search by title, author, or genre..."
        className="input-field pl-12 h-14 text-lg"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

export default Search;

