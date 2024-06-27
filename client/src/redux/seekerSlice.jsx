import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    seekerInfo:null
}

const seekerSlice = createSlice({
    name:"seekerInfo",
    initialState,
    reducers:{
       seekerData:(state,action)=>{
        state.seekerInfo = action.payload
       },

    }
})

export const { seekerData } = seekerSlice.actions;

export default seekerSlice.reducer;