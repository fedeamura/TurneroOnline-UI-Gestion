import _ from "lodash";

const metodos = {
  procesarLogin: token => {
    return new Promise((resolve, reject) => {
      metodos
        .validarToken(token)
        .then(resultado => {
          if (resultado == false) {
            debugger;
            reject("token_invalido");
            return;
          }

          metodos
            .datos(token)
            .then(datos => {
              metodos
                .getRolesDisponibles(token)
                .then(roles => {
                  if (roles.length == 0) {
                    reject("sin_permiso");
                    return;
                  }
                  resolve({ usuario: datos, token: token, roles: roles });
                })
                .catch(error => {
                  debugger;
                  reject("error");
                });
            })
            .catch(error => {
              debugger;
              reject("error");
            });
        })
        .catch(error => {
          debugger;
          reject("error");
        });
    });
  },

  validarToken: token => {
    const url = window.Config.WS_TURNERO + "/v1/Usuario/ValidarToken";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": token
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  datos: token => {
    const url = window.Config.WS_TURNERO + "/v1/Usuario/Usuario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": token
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getRolesDisponibles: token => {
    const url = window.Config.WS_TURNERO + "/v1/Usuario/RolesDisponibles";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": token
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  buscar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Usuario/Buscar?consulta=" + comando.consulta;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--IdEntidad": comando.idEntidad,
          "--Token": localStorage.getItem("token")
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
