import { useEffect, useState } from "react";

import LibraryView from "./views/LibraryView";
import Book from "./components/Book";
import { API_URL } from "../config";
import ButtonModal from "./components/ButtonModal";
import { borrow_book, return_book } from "./api/books";

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data?.books_list);
      });
  }, [setBooks]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if(selectedAction=== "borrow"){
      borrow_book(selectedBook, event.target.elements.username.value);
    }
    if(selectedAction=== "return"){
      return_book(selectedBook, event.target.elements.username.value);
    }
  }
  const selectHandler = (event) => {
    setSelectedBook(event.target.value);
  }
  return (
    <LibraryView>
      <select onChange={selectHandler} className="mb-2">
        <option disabled selected value>
          Select book
        </option>
        {books ? (
          books.map((book, index) => {
            if (book.amount > 0)
              return <option key={index}>{book.book_name}</option>;
          })
        ) : (
          <h1>Loading...</h1>
        )}
      </select>
      {selectedBook && (
        <form className="d-flex flex-column" onSubmit={onSubmitHandler}>
          <div>
            <input
              type="radio"
              name="radio-button"
              value="borrow"
              className="me-2"
              onChange={(e) => setSelectedAction(e.target.value)}
            />
            <label htmlFor="borrow">Wypożycz</label>
          </div>
          <div>
            <input
              type="radio"
              name="radio-button"
              value="return"
              className="me-2"
              onChange={(e) => setSelectedAction(e.target.value)}
            />
            <label htmlFor="borrow">Zwróć</label>
          </div>

          <label htmlFor="username" className="form-label">
            Nazwa użytkownika
          </label>
          <div className="d-flex gap-2 flex-wrap flex-md-nowrap align-self-start">
            <input
              id="username"
              type="text"
              className="form-control align-self-start"
            />
            <button type="submit" className="btn btn-primary">
              Wykonaj
            </button>
          </div>

        </form>
      )}
      <hr className="mt-4"></hr>
      <h4>Wszystkie książki</h4>
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
