import { configureStore } from '@reduxjs/toolkit'
import responsiveReducer from './slices/Responsive'
import themeReducer from './slices/ThemeSlice';

export default configureStore({
  reducer: {
    theme: themeReducer,
    responsive: responsiveReducer,
  },
})