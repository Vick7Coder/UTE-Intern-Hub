import {createSlice} from '@reduxjs/toolkit'

    const user = JSON.parse(localStorage.getItem('user'));
   
  const initialState = {
    user: user ? user : null,
  };

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

        login:(state,action)=>{
            state.user = action.payload;
            localStorage.setItem("user",JSON.stringify(action.payload))
        },
        logout:(state)=>{
            state.user = null;
            localStorage?.removeItem("user")
        },
        
        
    }
})




export  const {login,logout} = userSlice.actions;

export default userSlice.reducer;