import { useEffect, useState } from "react";

import LibraryView from "./views/LibraryView";
import Book from "./components/Book";
import { API_URL } from "../config";

const App = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data?.books_list);
      });
  }, [setBooks]);

  return (
    <LibraryView>
      {books ? (
        books.map((book, index) => {
          return <Book key={index} book_data={book} />;
        })
      ) : (
        <h1>Loading...</h1>
      )}
      {books.length === 0 && <h1>No books in library</h1>}
    </LibraryView>
  );
};

export default App;
