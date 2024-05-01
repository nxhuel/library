import { useState } from "react";
import {
  BookList,
  FilterBook,
  Navbar,
  Search,
  Title,
  TrendBookList,
} from "./components";
import { Book } from "./services";

function App() {
  const [result, setResult] = useState<Book[]>([]);
  return (
    <>
      <div className="flex flex-row bg-[#F0F0F0] dark:bg-[#10141F]">
        <Navbar />
        <div className="flex flex-col w-full pt-12 pr-8">
          <Search setResult={setResult} />
          <FilterBook result={result} />
          <Title title="Trending" />
          <TrendBookList />
          <Title title="Recommended for you" />
          <BookList />
        </div>
      </div>
    </>
  );
}

export default App;
