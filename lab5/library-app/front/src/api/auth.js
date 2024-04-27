import { API_URL } from "../../config";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  if (response.ok) {
    localStorage.setItem("token", json.token);
    window.alert("Zalogowano pomyślnie");
  } else {
    window.alert(json.error);
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.alert("Wylogowano pomyślnie");
  window.location.reload();
}