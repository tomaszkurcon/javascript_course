import { useEffect, useState } from "react";

import LibraryView from "./views/LibraryView";
import Book from "./components/Book";
import { API_URL } from "../config";

const App = () => {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data?.data);
      });
  }, [setBooks]);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <LibraryView token={token} setToken={setToken}>
      <hr className="mt-4"></hr>
      <h4>Wszystkie książki</h4>
      {!books && <h1>Loading...</h1>}
      {books?.length > 0 ? (
        books?.map((book, index) => {
          return <Book key={index} book_data={book} token={token} />;
        })
      ) : (
        <h1>No books in library</h1>
      )}
    </LibraryView>
  );
};

export default App;
