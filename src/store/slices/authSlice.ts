import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
  roleName: string;
}

interface User {
  id: string;
  userName: string;
}

interface AuthState {
  user: User | null;
  roles: Role[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem("user");
const storedRoles = localStorage.getItem("roles");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  roles: storedRoles ? JSON.parse(storedRoles) : [],
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; roles: Role[] }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("roles", JSON.stringify(action.payload.roles));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart(state) {
      state.loading = true;
    },
    registerSuccess(state) {
      state.loading = false;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
