import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import BackendUrl from "./BackendUrl";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let refreshTokenInterval;

  const saveUserLocalStorage = (codeResponse) => {
    localStorage.setItem("user", JSON.stringify(codeResponse));
  };

  const login = useGoogleLogin({
    overrideScope: true,
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: (codeResponse) => saveUserLocalStorage(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  function loginFun(e) {
    username === "" || password === ""
      ? alert("!אנא הכנס נתונים")
      : axios
          .post(`${BackendUrl()}/api/token/`, {
            username: username,
            password: password,
          })
          .then((response) => {
            localStorage.setItem(
              "Authorization",
              JSON.stringify(response.data)
            );

            setUsername("");
            setPassword("");
            navigate("/");
            startTokenRefreshTimer();
            login();
          });
  }

  function startTokenRefreshTimer() {
    if (refreshTokenInterval) {
      clearInterval(refreshTokenInterval);
    }
    refreshTokenInterval = setInterval(() => {
      axios
        .post(
          `${BackendUrl()}/api/token/refresh/`,
          {
            refresh: JSON.parse(localStorage.getItem("Authorization")).refresh,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          localStorage.setItem("Authorization", JSON.stringify(response.data));
        })
        .catch((error) => {
          clearInterval(refreshTokenInterval);
          navigate("/login");
        });
    }, 60 * 60 * 1000);
  }

  return (
    <div className="body">
      <div className="headLine">מערכת לניהול חוזים</div>
      <div className="subText">המערכת מאפשרת אינטרקציה בין היומן האישי שלך</div>
      <div className="subText">לחוזים והתשלומים של הלקוחות שלך</div>
      <br />
      <br />
      <br />
      <div>
        <label htmlFor="text">שם משתמש:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="הכנס שם משתמש.."
        />
      </div>
      <div>
        <label htmlFor="text">סיסמה:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="הכנס סיסמה.."
        />
      </div>

      <br />
      <br />

      <div className="buttonContainer">
        <button className="btn" onClick={loginFun}>
          התחבר
        </button>

        <button className="btn" onClick={() => navigate("/signup")}>
          הרשמה
        </button>
      </div>
    </div>
  );
};

export default Login;
