import _ from "lodash";
import { USUARIO_LOGIN, USUARIO_CERRAR_SESION, USUARIO_SELECCIONAR_ENTIDAD } from "@Redux/Constants/index";

const initialState = {
  usuario: undefined,
  token: undefined,
  roles: undefined,
  rol: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      localStorage.setItem("token", action.payload.token);
      return { ...state, usuario: action.payload.usuario, token: action.payload.token, roles: action.payload.roles };
    }
    case USUARIO_SELECCIONAR_ENTIDAD: {
      if (action.payload == undefined) {
        localStorage.setItem("idEntidad", undefined);
        return { ...state, rol: undefined };
      }
      
      if (state.usuario == undefined) return state;
      if (state.roles == undefined) return state;

      let rol = _.find(state.roles, item => {
        return item.entidadId == action.payload;
      });
      if (rol == undefined) return state;

      localStorage.setItem("idEntidad", action.payload);
      return { ...state, rol: rol };
    }
    case USUARIO_CERRAR_SESION: {
      localStorage.removeItem("token");
      localStorage.removeItem("idEntidad");
      return { ...state, usuario: undefined, token: undefined, roles: undefined };
    }
    default:
      return state;
  }
};
export default reducer;
