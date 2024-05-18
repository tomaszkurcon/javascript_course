import { useState } from "react";
import { API_URL } from "../../config";
import { login, logout } from "../api/auth";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { add_book, return_book } from "../api/books";

const LibraryView = ({ children, token, setToken }) => {
  const [userBooks, setUserBooks] = useState(null);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;

    const response = await fetch(
      `${API_URL}/admin/user_books?username=` + encodeURIComponent(username),
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      window.alert(data.error);
      return;
    }
    setUserBooks(data);
  };
  const onLoginHandler = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const response = await login(username, password);
    if (response.ok) {
      setToken(localStorage.getItem("token"));
    }
  };

  const addBookHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);
    const book_data = event.target.book_data.value;
    try {
      JSON.parse(book_data);
    } catch (err) {
      window.alert("Niepoprawny format danych");
      return;
    }
    const response = await add_book(book_data, token);
    const data = await response.json();
    if (!response.ok) {
      window.alert(data.error);
      return;
    }
    window.alert(data.message);
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Akademia Górniczo-Hutnicza</h2>
        {!token ? (
          <>
            <h4>
              Zaloguj się jako admin aby móc dodawać książki, sprawdzać książki
              czytelników oraz bieżących posiadaczy książek
            </h4>
            <div className="row">
              <form onSubmit={onLoginHandler} className="col-md-5">
                <label htmlFor="username" className="form-label">
                  Nazwa użytkownika
                </label>
                <input id="username" type="text" className="form-control" />

                <label htmlFor="password" className="form-label">
                  Hasło
                </label>
                <input id="password" type="password" className="form-control" />
                <button type="submit" className="btn btn-primary mt-2">
                  Zaloguj
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h3>Zalogowano jako: admin</h3>
            <button className="btn btn-primary mt-2" onClick={logout}>
              Wyloguj
            </button>
          </>
        )}
        {token && (
          <>
            <hr></hr>
            <h4>Sprawdź książki użytkownika</h4>
            <div className="row">
              <form onSubmit={onSubmitHandler} className="col-md-5">
                <label htmlFor="username" className="form-label">
                  Nazwa użytkownika
                </label>
                <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
                  <input id="username" type="text" className="form-control" />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!token}
                  >
                    Wyszukaj
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4 mb-4">
              {userBooks?.length ? (
                <>
                  <ul>
                    {userBooks.map((rental, index) => (
                      <li key={index}>
                        <img role="button" src={rental?.book_img} alt="Book" onClick={()=>return_book(rental.book_name, rental.username)}/>
                        {rental.book_name}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setUserBooks(null)}
                  >
                    Wyczyść
                  </button>
                </>
              ) : (
                userBooks && <div>Brak wypożyczonych książek</div>
              )}
            </div>
            <hr></hr>
          </>
        )}

        {token && (
          <>
            <h4>Dodaj książkę</h4>
            <p>
              {"Musisz podać dane w formacie JSON w dokładnie taki sposób: "}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{`{
              "book_name":"Java podstawy",
              "authors":["Jan Kowalski","Maurcy Heńko"],
              "faculty":"Wydział IET",
              "subject":"Cyberbezpieczeństwo",
              "course":"Programowanie skryptowe",
              "imgURL":"./src/images/java_book.jpg",
              "amount":3
}`}</p>
            <div className="row">
              <form onSubmit={addBookHandler} className="col-md-5">
                <label htmlFor="book_data" className="form-label">
                  Dane
                </label>
                <div>
                  <textarea
                    id="book_data"
                    type="text"
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-primary mt-2">
                    Dodaj
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        <div className="row">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default LibraryView;
