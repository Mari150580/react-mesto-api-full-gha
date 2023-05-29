import React, { useState } from "react";
import logo from "../../images/logo.svg";
import { Link } from "react-router-dom";

function Login({ handleLogin, authorizationEmail}) {
  const [userData, setUserData] = useState({ email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      return;
    }

    handleLogin(userData)
      .then(() => {
        setUserData({ email: "", password: "" });
      })
  }

  return (
    <div className="authorization">
      <div className="header">
        <img src={logo} alt="Логотип" className="header__logo" />
        <button className="header__button" type="button">
          <Link className="authorization__form-entrance_button" to="/sign-up">
            Регистрация
          </Link>
        </button>
      </div>

      <form className="authorization__form" onSubmit={handleSubmit}>
        <h1 className="authorization__form-title">Вход</h1>
        <input
          type="email"
          className="authorization__form-email"
          name="email"
          placeholder="Email"
          minLength={2}
          maxLength={30}
          id="email"
          required=""
          value={userData.email || ""}
          onChange={handleChange}
        />
        <div className="authorization__form-email_line"></div>

        <input
          type="password"
          className="authorization__form-password"
          name="password"
          placeholder="Пароль"
          minLength={4}
          maxLength={30}
          id="password"
          required=""
          value={userData.password || ""}
          onChange={handleChange}
        />
        <div className="authorization__form-email_line"></div>

        <button className="authorization__form-button" type="submit">
          <h2 className="authorization__form-button_title"> Войти</h2>
        </button>
      </form>
    </div>
  );
}

export default Login;
