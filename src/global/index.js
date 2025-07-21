import { configureStore } from '@reduxjs/toolkit'
import responsiveReducer from './slices/Responsive'
import themeReducer from './slices/ThemeSlice';
import authReducer from './slices/AuthSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    responsive: responsiveReducer,
  },
})