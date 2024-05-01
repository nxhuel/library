import { Book } from "../../services";
import GradeIcon from "@mui/icons-material/Grade";
import { Title } from "../Title";

interface FilterBookProps {
  result: Book[];
}

function FilterBook({ result }: FilterBookProps) {
  return (
    <>
      {result.length > 0 && (
        <>
          <Title title="Search Results" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {result.map((book, id) => {
              return (
                <div key={id} className="relative">
                  <div>
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="h-60 md:h-96 w-full"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 cursor-pointer"></div>
                  </div>
                  <div className="absolute text-white top-4 right-2 font-bold cursor-pointer hover:text-yellow-200">
                    <GradeIcon />
                  </div>
                  <div className="absolute text-white bottom-4 left-2">
                    <p>{book.authors}</p>
                    <h1 className="font-bold">{book.title}</h1>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {result.length === 0 && (
        <></>
      )}
    </>
  );
}

export default FilterBook;
