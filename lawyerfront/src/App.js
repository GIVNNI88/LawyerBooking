import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import ContractList from "./components/ContractList";
import AddContract from "./components/AddContract";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/addContract" element={<AddContract />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
