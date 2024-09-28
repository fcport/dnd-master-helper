import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {Doc} from "../models/db-response.model";
import {RootState} from "./index";


export interface DocumentState {
  documents: Doc[]
}

const initialState: DocumentState = {
  documents: []
}

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Doc>) => {
      state.documents.push(action.payload)
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc._id !== action.payload)
    },
    setDocuments: (state, action: PayloadAction<Doc[]>) => {
      state.documents = [...action.payload]
    }
  },
})


export const {addDocument, deleteDocument, setDocuments} = documentSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectDocuments = (state: RootState) => state.document.documents;

export default documentSlice.reducer
