import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
