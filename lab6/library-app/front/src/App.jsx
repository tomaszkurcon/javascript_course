import { useEffect, useState } from "react";

import LibraryView from "./views/LibraryView";
import Book from "./components/Book";
import { API_URL } from "../config";
import Username from "./components/Username";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import convert from "xml-js";
import { sell_book } from "./api/books";

const App = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [booksToSell, setBooksToSell] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((response) => response.text())
      .then((str) => {
        const result = convert.xml2json(str, {
          compact: true,
          spaces: 4,
          textKey: "",
        });
        const json = JSON.parse(result);
        console.log(json.data.books);
        const books = json.data.books.map((book) => {
          const newBook = {};
          for (const key in book) {
            if (key === "authors") {
              newBook[key] = Array.isArray(book[key])
                ? book[key].map((author) => author[""])
                : [book[key][""]];
            } else {
              newBook[key] = book[key][""];
            }
          }
          return newBook;
        });
        setBooks(books);
        setBooksToSell(books);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${API_URL}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data?.data);
      });
  }, [setBooks, setUsers]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(booksToSell);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBooksToSell(items);

    const { source, destination } = result;

    if (!destination) return;

    if (destination.droppableId === "sellArea") {
      const soldBook = books[source.index];
      sell_book(soldBook.book_name, token);
    } else if (destination.droppableId === "books") {
      const items = Array.from(books);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setBooks(items);
    }
  };

  return (
    <LibraryView token={token} setToken={setToken}>
      <hr className="mt-4"></hr>
      <h4>Użytkownicy</h4>
      {!users && <h1>Loading...</h1>}
      {users?.length > 0 ? (
        users?.map((user, index) => {
          return (
            <Username
              key={index}
              username={user.username}
              onClick={(username) => {
                setSelectedUser(username);
              }}
              selected={selectedUser === user.username}
            />
          );
        })
      ) : (
        <h1>No users in library</h1>
      )}
      <hr className="mt-4"></hr>
      <h4>Wszystkie książki</h4>
      {!books && <h1>Loading...</h1>}
      {books?.length > 0 ? (
        books?.map((book, index) => {
          return (
            <Book
              key={index}
              book_data={book}
              token={token}
              selectedUser={selectedUser}
            />
          );
        })
      ) : (
        <h1>No books in library</h1>
      )}
      <h4>Sprzedaż książki</h4>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="d-flex justify-content-around">
          <Droppable droppableId="books">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {booksToSell.map(({ _id, book_name }, index) => (
                  <Draggable
                    key={_id.toString()}
                    draggableId={_id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {book_name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <Droppable droppableId="sellArea">
            {(provided) => (
              <div
                style={{ width: "200px", height: "200px", maxWidth: "100%" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="border d-flex align-items-center justify-content-center"
              >
                <p>Sprzedaj</p>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </LibraryView>
  );
};

export default App;
