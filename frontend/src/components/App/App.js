import Main from "../Main/Main";
import PopupWithForm from "../PopupWithForm/PopupWithForm";
import ImagePopup from "../ImagePopup/ImagePopup";
import React, { useEffect, useState } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext/CurrentUserContext";
import api from "../../utils/Api";
import EditProfilePopup from "../PopupProfile/PopupProfile";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import * as auth from "../../utils/auth";
import InfoTooltipError from "../InfoTooltipError/InfoTooltipError";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import UnionRectangle from "../../images/UnionRectangle.svg";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipErrorPopupOpen, setIsInfoTooltipErrorPopupOpen] =
    useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  /*стейты для реализации регистрации*/
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailReg, setEmailReg] = useState("");

  // const []
  /*информация об успешной или нет авторизации*/
  const navigate = useNavigate();

  /*Логин*/

  function handleLogin({ email, password }) {
    return auth.authorize(email, password)
    .then((data) => {
      if (data.token) {
        setLoggedIn(true);
        localStorage.setItem("token", data.token);
        navigate("/", { replace: true });
      }
    })
    .catch((error) => {
      console.log(`Что то пошло не так ${error}`);
      handleInfoTooltipError();
    })
  }

  /*Регистрация*/

  function handleRegister({ email, password }) {
    return auth.register(email, password)
    .then(() => {
      navigate("/sing-in");
      handleInfoTooltip();
    })
    .catch((error) => {
      handleInfoTooltipError();
    })
  }

  /*проверка токена при загрузки страницы*/
   useEffect(() => {
    tokenCheck();
  }, []);

  /*проверка токена*/

  function tokenCheck() {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
      auth
        .getContent(token)
        .then((data) => {
          setLoggedIn(true);
          api.getToken(token);
          setEmailReg(data.email);
          navigate("/");
        })
        .catch(function (err) {
          console.log("Ошибка", err);
        });
    }
  }

  /*выход из системы*/
  function logout() {
    setLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/sign-in");
  }
  /*Заход данных ссервера*/

  useEffect(() => {
    console.log(loggedIn)
    if (loggedIn) {
    Promise.all([api.getAllProfile(), api.getAllTasks()])
    .then(([data, cards]) => {
        setCurrentUser(data);
        setCards(cards);
      })
      .catch(function (err) {
        console.log("Ошибка", err);
      });
  }}, [loggedIn, navigate]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleInfoTooltipError() {
    setIsInfoTooltipErrorPopupOpen(true);
  }
  function handleInfoTooltip() {
    setIsInfoTooltipPopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsInfoTooltipErrorPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  /*Постановка лайков и получение данных ссервера про лайки*/

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.data : c))
        );
      })
      .catch(function (err) {
        console.log("Ошибка", err);
      });
  }

  /*Удаление карточки*/

  function handleDeleteClick(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((prevCards) =>
          prevCards.filter((data) => data._id !== card._id)
        );
      })
      .catch(function (err) {
        console.log("Ошибка", err);
      });
  }

  /*Смена данных профиля на сервер*/

  function handleUpdateUser(data) {
    api
      .addNewProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(function (err) {
        console.log("Ошибка", err);
      });
  }

  /*Смена аватарки*/

  function handleUpdateAvatar(avatar) {
    api
      .addNewAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(function (err) {
        console.log("Ошибка avatar", err);
      });
  }

  /*Загрузка новой карточки*/

  function handleAddPlaceSubmit(data) {
    api
      .addNewTasks(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(function (err) {
        console.log("Ошибка", err);
      });
  }

  return (
    <>
      <div className="App">
        <div className="page">
          <CurrentUserContext.Provider value={currentUser}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    component={Main}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={setSelectedCard}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeleteClick}
                    loggedIn={loggedIn}
                    emailReg={emailReg}
                    logout={logout}
                  />
                }
              />
              <Route
                path="/sign-up"
                element={
                  <Register
                    handleRegister={handleRegister}
                    handleInfoTooltip={handleInfoTooltip}
                    handleInfoTooltipError={handleInfoTooltipError}
                  />
                }
              />
              <Route
                path="/sing-in"
                element=
                {<Login 
                  handleLogin={handleLogin}
                   />}
              />
              <Route
                path="*"
                element={
                  loggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/sing-in" replace />
                  )
                }
              />
            </Routes>

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />
            <PopupWithForm
              name="delit"
              title="Вы уверены?"
              buttonText="Да"
            ></PopupWithForm>
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            ></EditAvatarPopup>
            <ImagePopup onClose={closeAllPopups} card={selectedCard} />
            <InfoTooltip
              onClose={closeAllPopups}
              isOpen={isInfoTooltipPopupOpen}
              name="success"
              title="Вы успешно зарегистрировались!"
              Union={UnionRectangle}
            />
            <InfoTooltipError
              onClose={closeAllPopups}
              isOpen={isInfoTooltipErrorPopupOpen}
            />
          </CurrentUserContext.Provider>
        </div>
      </div>
    </>
  );
}

export default App;
