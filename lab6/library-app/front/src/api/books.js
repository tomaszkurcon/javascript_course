import { API_URL } from "../../config";

export const return_book = async (book_name, username) => {
  const response = await fetch(`${API_URL}/return_book`, {
    method: "DELETE",
    body: JSON.stringify({ book_name: book_name, username: username }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const res = await response.json();
  if (response.ok) {
    alert("Pomyślnie zwrócono książkę");
    window.location.reload();
  } else {
    alert(res.error);
  }
};
export const borrow_book = async (book_name, username, book_img) => {
  const response = await fetch(`${API_URL}/borrow_book`, {
    method: "POST",
    body: JSON.stringify({ book_name: book_name, username: username, book_img:book_img }),
    headers: {
      "Content-Type": "application/json",
    },
    
  });
  const res = await response.json();
  if (response.ok) {
    alert("Pomyślnie wypożyczono książkę");
    window.location.reload();
  } else {
    alert(res.error);
  }
};

export const add_book = async (book_data, token) => {
  return await fetch(`${API_URL}/admin/add_book`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
    body: book_data,
  });
}

export const sell_book = async (book_name, token) => {
  const response = await fetch(`${API_URL}/admin/sell_book`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ book_name: book_name }),
  });
  const res = await response.json();
  if (response.ok) {
    alert("Pomyślnie sprzedano książkę");
    window.location.reload();
  } else {
    alert(res.error);
  }
}
