import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    companyInfo:null
}

const adminSlice = createSlice({
    name:"AdminInfo",
    initialState,
    reducers:{
       cmpData:(state,action)=>{
        state.companyInfo = action.payload
       },

    }
})

export const { cmpData} = adminSliceSlice.actions;

export default adminSlice.reducer;