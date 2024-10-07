import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {Doc} from "../models/db-response.model";
import {RootState} from "./index";


export interface DocumentState {
  documents: Doc[],
  activeDocument: Doc | null
}

const initialState: DocumentState = {
  documents: [],
  activeDocument: null

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
    },
    setActiveDocument: (state, action: PayloadAction<Doc>) => {
      state.activeDocument = action.payload
    },
    resetActiveDocument: (state) => {
      state.activeDocument = null
    },

  },
})


export const {addDocument, deleteDocument, resetActiveDocument, setActiveDocument, setDocuments} = documentSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectDocuments = (state: RootState) => state.document.documents;
export const selectActiveDocument = (state: RootState) => state.document.activeDocument;

export default documentSlice.reducer
