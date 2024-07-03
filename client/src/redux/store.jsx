import {configureStore} from "@reduxjs/toolkit";

import userReducer from './userSlice'
import cmpReducer from './companySlice'
import seekerReducer from './seekerSlice'
import adminReducer from './adminSlice'
import lecturerReducer from './lecturerSlice'


export const store = configureStore({

    reducer:{
        user: userReducer,
        cmp : cmpReducer,
        seeker: seekerReducer,
        ad: adminReducer,
        lt: lecturerReducer,
    }

})