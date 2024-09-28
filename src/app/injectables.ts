import {injectDispatch, injectSelector} from "@reduxjs/angular-redux";
import type {RootState, AppDispatch} from "./store";

// Use throughout your app instead of plain `injectDispatch` and `injectSelector`
export const injectAppDispatch = injectDispatch.withTypes<AppDispatch>();
export const injectAppSelector = injectSelector.withTypes<RootState>();
