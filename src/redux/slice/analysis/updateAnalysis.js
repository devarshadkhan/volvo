import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken, makeApiRequest, notify } from "../../../utils/utils";

export const editUpdateAnalysis = createAsyncThunk(
  "getAllAnalysisData",
  async ({id, data}) => {
    return await makeApiRequest(`/api/analysis/update?analysisId=${id}`, {
      token: getToken(),
      data,
      method: "POST",
    });
  }
);

const initialState = {
  data: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

const updateAnalysis = createSlice({
  name: "createAnalysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editUpdateAnalysis.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(editUpdateAnalysis.fulfilled, (state, { payload }) => {
        // console.log("UPPDATEAPI", payload);  
        state.data = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload.message;
      })
      .addCase(editUpdateAnalysis.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
        console.log("Error: ", error.message);
      });
  },
});

export default updateAnalysis.reducer;