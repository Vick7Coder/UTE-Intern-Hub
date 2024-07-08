import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    companyInfo: null
}

const companySlice = createSlice({
    name: "companyInfo",
    initialState,
    reducers: {
        cmpData: (state, action) => {
            state.companyInfo = action.payload
        },
    }
})

export const { cmpData } = companySlice.actions;

export default companySlice.reducer;