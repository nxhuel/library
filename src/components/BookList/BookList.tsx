import { useEffect, useState } from "react";
import "./style/index.css";
import axios from "axios";
import { API_URL, Book } from "../../services";
import GradeIcon from "@mui/icons-material/Grade";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const shuffledBooks = res.data.sort(() => Math.random() - 0.5);
        const selectedBook = shuffledBooks.slice(0, 10);
        setBooks(selectedBook);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className=" w-full grid grid-cols-2 md:grid-cols-5 gap-4 pb-8">
      {books.map((book) => (
        <div key={book.id} className="relative">
          <div>
            <img
              src={book.image_url}
              alt={book.title}
              className="h-60 md:h-96 w-full "
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 cursor-pointer"></div>
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
export default BookList;
