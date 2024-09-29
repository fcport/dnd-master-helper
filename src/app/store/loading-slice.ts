import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./index";


export interface LoadingState {
  loadingMessage: string;
  operations: number;
  loadingDocumentNumber: number;
  totalLoadingDocuments: number;
}

const initialState: LoadingState = {
  loadingMessage: '',
  operations: 0,
  loadingDocumentNumber: 0,
  totalLoadingDocuments: 0
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingMessage: (state, action: PayloadAction<string>) => {
      state.loadingMessage = action.payload
    },
    resetLoadingMessage: (state) => {
      state.loadingMessage = ''
    },
    incrementOperations: (state) => {
      state.operations += 1
    },
    decrementOperations: (state) => {
      state.operations -= 1
    },
    setLoadingDocumentNumber: (state, action: PayloadAction<number>) => {
      state.loadingDocumentNumber = action.payload
    },
    setTotalLoadingDocuments: (state, action: PayloadAction<number>) => {
      state.totalLoadingDocuments = action.payload
    },
    resetTotalLoadingDocuments: (state) => {
      state.totalLoadingDocuments = 0
    },
    resetLoadingDocumentNumber: (state) => {
      state.loadingDocumentNumber = 0
    }
  },
})


export const {
  setLoadingMessage,
  resetLoadingMessage,
  resetLoadingDocumentNumber,
  resetTotalLoadingDocuments,
  setLoadingDocumentNumber,
  setTotalLoadingDocuments,
  incrementOperations,
  decrementOperations
} = loadingSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoading = (state: RootState) => state.loading.operations > 0;
export const selectLoadingDocumentsMessage = (state: RootState) =>
  state.loading.totalLoadingDocuments !== 0 && state.loading.loadingDocumentNumber !== 0 ?
    `Loading document ${state.loading.loadingDocumentNumber} of ${state.loading.totalLoadingDocuments}` : '';

export const selectTotalLoadingDocuments = (state: RootState) => state.loading.totalLoadingDocuments;

export default loadingSlice.reducer
