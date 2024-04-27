import { API_URL } from "../../config";

export const return_book = async (book_name, username) => {
  const response = await fetch(`${API_URL}/return_book`, {
    method: "POST",
    body: JSON.stringify({ book_name: book_name, username: username }),
  });
  if (response.ok) {
    alert("Pomyślnie zwrócono książkę");
    window.location.reload();
  } else {
    alert("Nie udało się zwrócić książki");
  }
};
export const borrow_book = async (book_name, username) => {
  const response = await fetch(`${API_URL}/borrow_book`, {
    method: "POST",
    body: JSON.stringify({ book_name: book_name, username: username }),
  });
  if (response.ok) {
    alert("Pomyślnie wypożyczono książkę");
    window.location.reload();
  } else {
    alert("Nie udało się wypożyczyć książki");
  }
};
