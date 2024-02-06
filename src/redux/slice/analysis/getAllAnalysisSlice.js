import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken, makeApiRequest, notify } from "../../../utils/utils";

export const getAnalysisDataListing = createAsyncThunk(
  "getAllAnalysisData",
  async (params) => {
    return await makeApiRequest(
      `/api/analysis/get-all-data?page=${params}`,
      {
        token: getToken(),
      }
    );
  }
);

const initialState = {
    analysisData: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

const getAllAnalysisSlice = createSlice({
  name: "getDashboardData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnalysisDataListing.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getAnalysisDataListing.fulfilled, (state, { payload }) => {
        state.analysisData = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload.message;
      })
      .addCase(getAnalysisDataListing.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
        console.log("Error: ", error.message);
      });
  },
});

export default getAllAnalysisSlice.reducer;
