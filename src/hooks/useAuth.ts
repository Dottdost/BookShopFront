import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
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

// Обновлённый интерфейс для JWT
interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
  exp: number;
  iss: string;
  aud: string;
}

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
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      console.log("Login response:", result);

      const accessToken = result.data?.accessToken;
      const refreshToken = result.data?.refreshToken;
      const userId = result.data?.userId; // Получаем userId из ответа

      if (!accessToken || !refreshToken || !userId) {
        throw new Error("Access token, refresh token, or userId is missing");
      }

      const decoded: JwtPayload = jwtDecode(accessToken);
      console.log("Decoded JWT:", decoded);

      const rawRoles =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
      const rolesForStore = rolesArray.map((r: string) => ({ roleName: r }));

      const user = {
        id: userId, // Используем userId из ответа
        userName:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      };

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(loginSuccess({ user, roles: rolesForStore }));

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return { handleLogin, handleRegister, handleLogout };
};
