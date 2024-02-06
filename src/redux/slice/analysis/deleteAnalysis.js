import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken, makeApiRequest, notify } from "../../../utils/utils";

export const deleteAnalysisData = createAsyncThunk(
  "getAllAnalysisData",
  async (delID) => {
    return await makeApiRequest(
      `/api/analysis/delete-by-id?analysisId=${delID}`,
      {
        method: "DELETE",
        token: getToken(),
      }
    );
  }
);

const initialState = {
  data: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

const deleteAnalysis = createSlice({
  name: "deleteAnalysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteAnalysisData.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(deleteAnalysisData.fulfilled, (state, { payload }) => {
        // console.log(payload);
        state.data = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload.message;
      })
      .addCase(deleteAnalysisData.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
        console.log("Error: ", error.message);
      });
  },
});

export default deleteAnalysis.reducer;
