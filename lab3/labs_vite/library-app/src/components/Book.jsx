import { useContext } from "react";
import { borrow_book, return_book, show_book_users } from "../indexedDB/api";
import ButtonModal from "./ButtonModal";
import { DbContext } from "../context/DbContext";

const Book = ({ book_data }) => {
  const { book_name, authors, faculty, subject, imgURL, amount } = book_data;
  const db = useContext(DbContext);

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <div className="card p-0 ">
        <div className="card-header">{faculty}</div>
        <div className="card-body p-0">
          <h5 className="card-title">{subject}</h5>
          <img src={imgURL} alt="Book image" className="card-img-top" />
          <p className="card-text">
            <span className="fw-bold">Nazwa książki: {book_name}</span>
          </p>

          <p className="card-text">
            <span className="fw-bold">Autorzy: </span>
            <span>
              {authors?.map((author, index) => (
                <span key={index}>{`${author}, `}</span>
              ))}
            </span>
          </p>

          <div className="alert alert-info mt-3" role="alert">
            Ilość egzemplarzy: {amount}
          </div>
          <div className="d-flex justify-content-around p-2">
            <ButtonModal
              id={`borrow-${book_name.replace(/\s/g, "")}`}
              className={"btn-success"}
              title="Wypożycz"
              onSubmit={(username) => {
                borrow_book({ book_name: book_name, username: username }, db);
              }}
              disabled={amount === 0}
            />
            <ButtonModal
              id={`return-${book_name.replace(/\s/g, "")}`}
              className={"btn-warning"}
              title="Zwróć"
              onSubmit={(username) => {
                return_book({ book_name: book_name, username: username }, db);
              }}
            />
            <ButtonModal
              id={`show-${book_name.replace(/\s/g, "")}`}
              className={"btn-primary"}
              title="Pokaż czytelników"
              withForm={false}
              onClickShowData={() => {
                return show_book_users(book_name, db);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
