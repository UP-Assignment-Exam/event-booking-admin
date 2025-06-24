import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash';

export const responsiveSlice = createSlice({
    name: 'responsive',
    initialState: {
        screen: "PC",
    },
    reducers: {
        changeScreen: (state, action) => {
            if (!_.isEmpty(action.payload)) {
                state.screen = action.payload
            }
            return state;
        },
    }
})

export const { changeScreen } = responsiveSlice.actions

export default responsiveSlice.reducer