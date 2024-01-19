import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let refreshTokenInterval;

  function loginFun(e) {
    username === "" || password === ""
      ? alert("!אנא הכנס נתונים")
      : axios
          .post("http://lawbooking.lawbooking.site:8000/api/token/", {
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
          });
  }

  function startTokenRefreshTimer() {
    if (refreshTokenInterval) {
      clearInterval(refreshTokenInterval);
    }
    refreshTokenInterval = setInterval(() => {
      axios
        .post(
          "http://lawbooking.lawbooking.site:8000/api/token/refresh/",
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
      <div>ברוכים הבאים</div>
      <div className="headLine">מערכת לניהול חוזים</div>
      <div>מאפשרת אינטרקציה עם היומן האישי שלך</div>
      <div>והחוזים/תשלומים של לקוחותיך</div>
      <br />
      <br />

      <div className="form-control">
        <label htmlFor="text">שם משתמש:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="הכנס שם משתמש.."
        />
      </div>
      <div className="form-control">
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
