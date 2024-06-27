import {configureStore} from "@reduxjs/toolkit";

import userReducer from './userSlice'
import cmpReducer from './companySlice'
import seekerReducer from './seekerSlice'


export const store = configureStore({

    reducer:{
        user: userReducer,
        cmp : cmpReducer,
        seeker: seekerReducer,
    }

})