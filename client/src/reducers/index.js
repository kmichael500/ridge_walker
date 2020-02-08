import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import 'leaflet/dist/leaflet.css';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});