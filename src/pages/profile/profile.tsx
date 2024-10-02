import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import formStyles from "../form.module.css";
import profileStyles from "./profile.module.css";
import {
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import {
  logoutUser,
  updateUserProfile,
} from "../../services/reducers/userSlice";
import { ProfileOrders } from "../../components/profileOrders/profileOrders";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [isDirty, setIsDirty] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setInitialName(user.name || "");
      setInitialEmail(user.email || "");
    }
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsDirty(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsDirty(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsDirty(true);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const resultAction = await dispatch(logoutUser(refreshToken)).unwrap();
        if (resultAction.success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } else {
          console.error("Ошибка выхода из системы:", resultAction.message);
        }
      } catch (error) {
        console.error("Ошибка выхода из системы:", error);
      }
    }
    navigate("/login");
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name !== initialName || email !== initialEmail || password) {
      try {
        const resultAction = await dispatch(
          updateUserProfile({ name, email, password })
        ).unwrap();
        if (resultAction) {
          setMessage("Данные были успешно изменены");
          setMessageType("success");
        }
      } catch (error) {
        setMessage("Не получается обновить данные");
        setMessageType("error");
      }
    }
    const timer = setTimeout(() => {
      setIsDirty(false);
      setMessage(null);
    }, 2000);
    return () => clearTimeout(timer);
  };

  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setPassword("");
    setMessage(null);
    setIsDirty(false);
  };

  return (
    <div className={profileStyles.profile_container}>
    <div className={profileStyles.profile_content}>
      <div className={profileStyles.profile_list}>
        <ul>
          <li className="text text_type_main-large p-2">
            <a href="/profile">Профиль</a>
          </li>
          <li className="text text_type_main-large p-2">
            <a href="https://thejester32.github.io/burger-app-deploy/#/profile/orders">История заказов</a>
          </li>
          <li className="text text_type_main-large p-2">
            <p onClick={handleLogout}>Выход</p>
          </li>
        </ul>
        {location.pathname === "/profile/orders" ? (
          <p
          className={`text text_type_main-default text_color_inactive p-2 ${profileStyles.profile_info_text}`}
          >
            В этом разделе вы можете просмотреть свою историю заказов
          </p>
        ) : (
          <p
            className={`text text_type_main-default text_color_inactive p-2 ${profileStyles.profile_info_text}`}
          >
            В этом разделе вы можете изменить свои персональные данные
          </p>
        )}
      </div>
      {location.pathname === "/profile/orders" ? (
        <div className={profileStyles.profile_orders_wrapper}>
          <ProfileOrders />
        </div>
      ) : (
        <div className={formStyles.wrapper}>
          <form className={formStyles.form} onSubmit={handleProfileUpdate}>
            <Input
              type="text"
              placeholder="Имя"
              name="name"
              value={name}
              icon={"EditIcon"}
              extraClass={formStyles.input}
              onChange={handleNameChange}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            <Input
              type="email"
              placeholder="E-mail"
              name="email"
              value={email}
              icon={"EditIcon"}
              extraClass={formStyles.input}
              onChange={handleEmailChange}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            <Input
              name="password"
              value={password}
              placeholder="Пароль"
              icon={"EditIcon"}
              extraClass={formStyles.input}
              onChange={handlePasswordChange}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            <div className={formStyles.buttons}>
              {isDirty && (
                <>
                  {message && (
                    <p
                      className={`text text_type_main-small p-2 ${
                        messageType === "success"
                          ? "text_color_success"
                          : "text_color_error"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <Button type="primary" size="medium" htmlType="submit">
                    Сохранить
                  </Button>
                  <Button
                    type="secondary"
                    size="medium"
                    htmlType="button"
                    onClick={handleCancel}
                  >
                    Отмена
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
    </div>
  );
}

export { Profile };
