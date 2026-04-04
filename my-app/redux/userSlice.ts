import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "@/service/authService";
import Cookies from "js-cookie";
import { getProfileRequest, logoutUserRequest } from "@/service/userService";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

type LoginFormData = {
  email: string;
  password: string;
};

type AuthUser = {
  uid?: number;
  name?: string;
  email?: string;
  timezone?: string | null;
  img?: string | null;
  currency?: string | null;
  createdAt?: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type ProfileResponse = {
  user: AuthUser;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response?.data
      ?.message === "string"
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message as string;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const signup = createAsyncThunk(
  "user/signup",
  async (data: SignupFormData, { rejectWithValue }) => {
    try {
      return await registerUser(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Signup failed"));
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      await logoutUserRequest(refreshToken);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getProfileRequest();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch profile"));
    }
  }
);

interface UserState {
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
  accessToken: string | null;
  success: boolean;
  signupSuccess: boolean;
}

const loadState = (): Partial<UserState> => {
  if (typeof window === "undefined") return {};
  try {
    // Rehydrate auth state on the client so route guards survive page reloads.
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    return {
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken ?? null,
    };
  } catch {
    return {};
  }
};

const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
  accessToken: null,
  success: false,
  signupSuccess: false,
  ...loadState(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.success = false;
      state.signupSuccess = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
    },
    
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
      state.signupSuccess = false;
    },
    syncUser: (state, action) => {
      state.user = action.payload as AuthUser;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.signupSuccess = true; 
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.signupSuccess = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        const payload = action.payload as LoginResponse;
        state.loading = false;
        state.success = true;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.setItem("accessToken", payload.accessToken);
        Cookies.set("refreshToken", payload.refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const payload = action.payload as ProfileResponse;
        // Keep Redux and localStorage aligned with the backend profile source of truth.
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearStatus, syncUser } = userSlice.actions;
export default userSlice.reducer;
