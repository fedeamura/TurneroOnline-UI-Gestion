import _ from "lodash";

const metodos = {
  get: () => {
    const url = window.Config.WS_TURNERO + "/v1/EstadoTurno";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      })
        .then(data => {
          if (data.ok != true) {
            reject("Error procesando la solicitud");
            return;
          }
          return data.json();
        })
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error);
            return;
          }

          let turnos = data.return;
          turnos.push({
            keyValue: -1,
            nombre: "Vencido",
            color: "#9E9E9E"
          });

          turnos = _.orderBy(turnos, "keyValue");
          resolve(turnos);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
