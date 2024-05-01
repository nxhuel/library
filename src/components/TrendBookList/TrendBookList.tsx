import GradeIcon from "@mui/icons-material/Grade";
import { API_URL, Book } from "../../services";
import "./style/index.css";
import { useEffect, useState } from "react";
import axios from "axios";

function TrendBookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const shuffledBooks = res.data.sort();
        const selectedBooks = shuffledBooks.slice(0, 4);
        setBooks(selectedBooks);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 ">
      {books.map((book) => (
        <div key={book.id} className="relative">
          <div className="relative">
            <img src={book.image_url} alt={book.title} className=" h-72 md:h-96 w-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          </div>
          <div className="absolute text-white top-4 right-2 font-bold cursor-pointer hover:text-yellow-200">
            <GradeIcon />
          </div>
          <div className="absolute text-white bottom-4 left-2">
            <p>{book.authors}</p>
            <h1 className=" font-bold">{book.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
}
export default TrendBookList;
