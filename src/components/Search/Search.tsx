import SearchIcon from "@mui/icons-material/Search";
import "./style/index.css";
import { useState } from "react";
import { API_URL, Book } from "../../services";

interface SearchProps {
  setResult: React.Dispatch<React.SetStateAction<Book[]>>;
}

function Search({ setResult }: SearchProps) {
  const [input, setInput] = useState<string>("");

  const fetchData = (value: string) => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((json: Book[]) => {
        const result = json.filter((book) => {
          return (
            value &&
            book &&
            book.title &&
            book.title.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResult(result);
      });
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div>
      <SearchIcon fontSize="medium" className="text-white cursor-pointer " />
      <span className="pl-4">
        <input
          type="search"
          placeholder="Search for Books"
          className="text-white w-[80%] h-10 pl-4 outline-none font-mono bg-transparent"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </span>
    </div>
  );
}

export default Search;
