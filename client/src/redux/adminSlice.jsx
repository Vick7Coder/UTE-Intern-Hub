import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo: null
}

const adminSlice = createSlice({
    name: "AdminInfo",
    initialState,
    reducers: {
        adData: (state, action) => {
            state.adminInfo = action.payload
        },

    }
})

export const { adData } = adminSlice.actions;

export default adminSlice.reducer;