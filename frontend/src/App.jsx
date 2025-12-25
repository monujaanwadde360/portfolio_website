import { Routes, Route } from "react-router-dom";

import MainHome from "./pages/MainHome";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthLayout from "./layouts/AuthLayout";
import PortfolioLayout from "./layouts/PortfolioLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<MainHome />} />

      {/* PROTECTED */}
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <PortfolioLayout />
          </ProtectedRoute>
        }
      />

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
