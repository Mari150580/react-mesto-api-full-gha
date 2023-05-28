// export const BASE_URL = "https://auth.nomoreparties.co";
//export const BASE_URL = "https://places.nomoredomains.rocks";
export const BASE_URL ="http://localhost:3000";
/*проверка res если ок то верни json если нет выведи ошибку*/
const getResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(getResponse);
};
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(getResponse);
};
export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      //authorization: `Bearer ${token}`,
    },
  })
    .then(getResponse);
};