import _ from "lodash";

const metodos = {
  insertar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TramitePorEntidad";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdEntidad": comando.idEntidad
        },
        body: JSON.stringify({ idEntidad: comando.idEntidad, nombre: comando.nombre, descripcion: comando.descripcion })
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
  actualizar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TramitePorEntidad";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTramite": comando.id
        },
        body: JSON.stringify({ nombre: comando.nombre, descripcion: comando.descripcion })
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
