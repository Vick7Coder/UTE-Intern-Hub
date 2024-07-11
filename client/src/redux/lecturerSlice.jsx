import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lecturerInfo: null
}

const lecturerSlice = createSlice({
    name: "lecturerInfo",
    initialState,
    reducers: {
        ltData: (state, action) => {
            state.lecturerInfo = action.payload
        },

    }
})

export const { ltData } = lecturerSlice.actions;

export default lecturerSlice.reducer;