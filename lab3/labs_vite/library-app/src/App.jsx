import { useContext, useEffect, useState } from "react";

import LibraryView from "./views/LibraryView";
import Book from "./components/Book";
import { DbContext } from "./context/DbContext";
import { get_books } from "./indexedDB/api";

const App = () => {
  const db = useContext(DbContext);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function fetchBooks() {
      if (db) {
        const books = await get_books(db);
        setBooks(books);
      }
    }
    fetchBooks();
  }, [db, setBooks]);

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
