import { USUARIO_LOGIN, USUARIO_CERRAR_SESION, USUARIO_SELECCIONAR_ENTIDAD } from "@Redux/Constants/index";

export const login = comando => ({ type: USUARIO_LOGIN, payload: comando });
export const seleccionarEntidad = id => ({ type: USUARIO_SELECCIONAR_ENTIDAD, payload: id });
export const cerrarSesion = () => ({ type: USUARIO_CERRAR_SESION });
