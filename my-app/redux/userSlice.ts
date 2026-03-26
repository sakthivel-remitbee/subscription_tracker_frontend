import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser } from "@/service/authService";

export const signup = createAsyncThunk(
  "user/signup",
  async (data: any, { rejectWithValue }) => {
    try {
      return await registerUser(data);
    } catch (err: any) {
      console.log("ERROR FULL:", err);
      console.log("ERROR RESPONSE:", err?.response);
      console.log("ERROR DATA:", err?.response?.data);

      return rejectWithValue(
        err?.response?.data?.message ||
        err?.message ||
        "Error"
      );
    }
  }
);
interface UserState {
  loading: boolean;
  error: string | null;
  user: any;
  success: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
  success: false, 
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
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
      });
  },
});

export default userSlice.reducer;