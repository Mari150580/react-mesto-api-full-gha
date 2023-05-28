import React from "react";
import logo from "../../images/logo.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register({
  handleRegister,
  handleInfoTooltipError,
  handleInfoTooltip,
}) {
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

    if (userData) {
      handleRegister(userData)
        .then(() => {
          handleInfoTooltip();
        })
        .catch((error) => {
          handleInfoTooltipError();
        });
    }
  }

  return (
    <div className="authorization">
      <header className="header">
        <img src={logo} alt="Логотип" className="header__logo" />
        <button className="header__button" type="button">
          <Link className="authorization__form-entrance_button" to="/sing-in">
            Войти
          </Link>
        </button>
      </header>

      <form className="authorization__form" onSubmit={handleSubmit}>
        <h1 className="authorization__form-title">Регистрация</h1>
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
          <h2 className="authorization__form-button_title">
            {" "}
            Зарегистрироваться
          </h2>
        </button>
        <div className="authorization__form-entrance">
          <p className="authorization__form-entrance_title">
            Уже зарегистрированы?
            <Link className="authorization__form-entrance_button" to="/sing-in">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
