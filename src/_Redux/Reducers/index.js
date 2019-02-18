import Usuario from "./usuario";
import Alerta from "./alerta";
import MainContent from "./mainContent";
import Notificaciones from "./notificaciones";
import General from "./general";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Usuario,
  Alerta,
  MainContent,
  Notificaciones,
  General
});

export default rootReducer;
