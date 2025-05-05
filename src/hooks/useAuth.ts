import { useDispatch } from "react-redux";

import { clearFavorites } from "../store/slices/favoritesSlice";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  registerFailure,
  registerStart,
  registerSuccess,
} from "../store/slices/authSlice";
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
        loginSuccess({
          user: { id: data.userId ?? "", userName: data.username },
          isAdmin: data.isAdmin,
        })
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
    dispatch(registerStart());

    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Account/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: username,
            email,
            password,
            confirmPassword: password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Registration failed");
      }

      dispatch(registerSuccess());
      return { success: true };
    } catch (error) {
      dispatch(
        registerFailure(
          error instanceof Error ? error.message : "Registration failed"
        )
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavorites());
    dispatch(clearOrders());
  };

  return { handleLogin, handleRegister, handleLogout };
};
