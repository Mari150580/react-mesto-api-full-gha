import logo from "../../images/logo.svg";

function Header({ emailReg, logout }) {
  return (
    <header className="header">
      <img src={logo} alt="Логотип" className="header__logo" />

      <p className="header__email">
        {emailReg}
        <button className="header__button" type="button" onClick={logout}>
          Выйти
        </button>
      </p>
    </header>
  );
}

export default Header;
