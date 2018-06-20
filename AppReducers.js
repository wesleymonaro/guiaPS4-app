import { combineReducers } from "redux";
import NavigationReducer from "./NavigationReducer";

import UserReducer from './src/Screens/Reducers/UserReducer'

const AppReducers = combineReducers({
  NavigationReducer,
  UserReducer
});

export default AppReducers;