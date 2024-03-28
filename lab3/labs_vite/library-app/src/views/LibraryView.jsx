import { useContext, useState } from "react";
import LogoComponent from "../components/Logo/LogoComponent";
import { show_user_books } from "../indexedDB/api";
import { DbContext } from "../context/DbContext";

const LibraryView = ({ children }) => {
  const [userBooks, setUserBooks] = useState(null);
  const db = useContext(DbContext);
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const userBooks = await show_user_books(username, db);
    setUserBooks(userBooks);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <LogoComponent />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Książki
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Do wypożyczenia
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Do kupienia
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn btn-outline-secondary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      <div className="container">
        <h2>Akademia Górniczo-Hutnicza</h2>
        <h4>Sprawdź Twoje książki</h4>
        <div className="row">
          <form onSubmit={onSubmitHandler} className="col-md-5">
            <label htmlFor="username" className="form-label">
              Nazwa użytkownika
            </label>
            <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
              <input id="username" type="text" className="form-control" />
              <button type="submit" className="btn btn-primary">
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
                  <li key={index}>{rental.book_name}</li>
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
        <h4>Dostępne książki</h4>
        <div className="row">{children}</div>
      </div>
      <footer className="d-flex justify-content-center bg-light bg-gradient my-5 px-2 container-xl">
        <div className="d-flex gap-3">
          <span className="w-100">
            Biblioteka Główna Akademii Górniczo-Hutniczej
          </span>

          <span className="w-100 d-flex">
            <i className="bi bi-envelope-fill me-1"></i>
            <a className="link-primary link-underline-dark">
              bgagh@bg.agh.edu.pl
            </a>
          </span>
          <span className="w-100 d-flex">
            <i className="bi bi-telephone-fill me-1"></i>
            <a className="link-primary link-underline-dark">+48 12 617 32 08</a>
          </span>
        </div>
      </footer>
    </>
  );
};

export default LibraryView;
