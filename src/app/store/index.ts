import {configureStore} from '@reduxjs/toolkit'

import documentReducer from './document-slice'
import loadingReducer from './loading-slice'

export const store = configureStore({
  reducer: {
    document: documentReducer,
    loading: loadingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
