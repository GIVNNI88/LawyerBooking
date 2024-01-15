import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function signUp() {
    if (username === "" || password === "" || email === "" ) {
      alert("אנא הכנס את כל השדות");
    } else {
      axios
        .post("http://127.0.0.1:8000/base/signup/", {
          username: username,
          password: password,
          email: email,
        })
        .then((response) => {
          console.log("User signed up:", response.data);
          setUsername("");
          setPassword("");
          setEmail("");
          navigate("/login");
        })
        .catch((error) => {
          console.error("Signup error:", error);
        });
    }
  }

  return (
    <div className="body">
      <h3>הרשמה:</h3>

      <div className="form-control">
        <label htmlFor="text">שם משתמש:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="הזן שם משתמש.."
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">סיסמה:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="הזן סיסמה.."
        />
      </div>
      <div className="form-control">
        <label htmlFor="email">אימייל:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="הזן כתובת אימייל.."
        />
      </div>


      <button className="btn" onClick={signUp}>
        הרשם
      </button>
    </div>
  );
};

export default SignUp;
