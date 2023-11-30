import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import accountActionServices from "./accountActionService";

const initialState = {
  accountsList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Account Requests
export const getAllAccounts = createAsyncThunk(
  "admin/getAllAccounts",
  async (adminData, thunkAPI) => {
    try {
      return await accountActionServices.getAllAccounts()
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addAllInterest = createAsyncThunk(
  "admin/addAllInterest" , 
  async (account_id,thunkAPI)=>{
    try {
      return await accountActionServices.addAllInterest(account_id) ;
    }
    catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
)

export const accountActionsSlice = createSlice({
  name: "AccountActions",
  initialState,
  reducers: {
    resetAccoutActions: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccounts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.accountsList = action.payload;
      })
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
      })
      .addCase(addAllInterest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(addAllInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "interest calculation successful";
        state.accountsList = state.accountsList.map((user) => {
          if (Number(user._id) === Number(action.payload._id)) {
            return action.payload;
          }
          return user;
        });
      })
      .addCase(addAllInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
      })
  },
});

export const { resetAccoutActions } = accountActionsSlice.actions;

export default accountActionsSlice.reducer;
