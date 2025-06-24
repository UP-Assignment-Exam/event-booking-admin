import { configureStore } from '@reduxjs/toolkit'
import responsiveReducer from './slices/Responsive'

export default configureStore({
  reducer: {
    responsive: responsiveReducer,
  },
})