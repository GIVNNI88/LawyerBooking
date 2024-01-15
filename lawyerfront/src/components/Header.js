import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

export const Header = () => {
  const navigate = useNavigate();
  const authorization = localStorage.getItem("Authorization");
  const isAuthenticated =
    authorization && authorization !== null && authorization !== "";

  let logoutUser = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("Authorization");
    navigate("/login");
  };

  // Google account

  const saveUserLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const getUserLocalStorage = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const [user, setUser] = useState(getUserLocalStorage);

  const login = useGoogleLogin({
    overrideScope: true,
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const refreshToken = useCallback(() => {
    login();
  }, [login]);

  useEffect(() => {
    if (user) {
      saveUserLocalStorage(user);
    }
  }, [user]);

  useEffect(() => {
    const intervalId = setInterval(refreshToken, 60 * 60 * 1000); // 60 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [login, refreshToken]);

  const logOut = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("Authorization");
    navigate("/login");
  };

  return (
    <div className="header">
      {isAuthenticated && (
        <>
          {user !== null ? (
            <div>
              <button className="linkButton" onClick={logOut}>
                <img
                  src="/google exit.png"
                  alt="home Logo"
                  style={{ width: "40px", height: "30px" }}
                />
              </button>
            </div>
          ) : (
            <button className="linkButton" onClick={() => login()}>
              <span style={{ lineHeight: "20px" }}>
                התחבר לGmail
                <img
                  src="/Gmail.png"
                  alt="Gmail Logo"
                  style={{
                    width: "30px",
                    height: "25px",
                    verticalAlign: "middle",
                    marginRight: "5px",
                  }}
                />
              </span>
            </button>
          )}
          <Link className="linkButton" to="/contracts">
            <img src="/file.png" alt="file Logo" style={{ width: "35px", height: "35px" }} />
          </Link>

          <Link className="linkButton" to="/addContract">
            <img
              src="/new-file.png"
              alt="new-file Logo"
              style={{ width: "35px", height: "35px" }}
            />
          </Link>
          <Link className="linkButton" to="/">
            <img src="/home.png" alt="home Logo" style={{ width: "35px", height: "35px" }} />
          </Link>

          <button className="linkButton" onClick={logoutUser}>
            <img src="/exit.png" alt="home Logo" style={{ width: "35px", height: "35px" }} />
          </button>
        </>
      )}
      {!isAuthenticated && (
        <>
          <Link className="linkButton" to="/login">
            כניסה
          </Link>

          <Link className="linkButton" to="/signup">
            הרשמה
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
