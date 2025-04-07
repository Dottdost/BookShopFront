import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../store/slices/authSlice";
import { clearFavorites } from "../store/slices/favoritesSlice";
import { clearOrders } from "../store/slices/ordersSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleLogin = async (username: string, password: string) => {
    dispatch(loginStart());

    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Auth/Login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: username, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("username", data.username);
      localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));

      dispatch(
        loginSuccess({ username: data.username, isAdmin: data.isAdmin })
      );
      return { success: true };
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Account/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: username, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");

    dispatch(logout());
    dispatch(clearFavorites());
    dispatch(clearOrders());
  };

  return { handleLogin, handleRegister, handleLogout };
};
