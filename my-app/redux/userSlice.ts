import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "@/service/authService";
import Cookies from "js-cookie";

export const signup = createAsyncThunk(
  "user/signup",
  async (data: any, { rejectWithValue }) => {
    try {
      return await registerUser(data);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Signup failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Login failed"
      );
    }
  }
);

interface UserState {
  loading: boolean;
  error: string | null;
  user: any;
  accessToken: string | null;
  success: boolean;
}

const loadState = (): Partial<UserState> => {
  if (typeof window === "undefined") return {};
  try {
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
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
    },
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        // persist
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.accessToken);
        Cookies.set("refreshToken", action.payload.refreshToken, {
          expires: 7,       // 7 days
          secure: true,
          sameSite: "Strict",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { logout, clearStatus } = userSlice.actions;
export default userSlice.reducer;