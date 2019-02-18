import _ from "lodash";
import DateUtils from "@Componentes/Utils/Date";

const ESTADO_VENCIDO_KEY_VALUE = -1;
const ESTADO_DISPONIBLE_KEY_VALUE = 1;
const ESTADO_RESERVADO_KEY_VALUE = 2;
const ESTADO_COMPLETADO_KEY_VALUE = 3;
const ESTADO_CANCELADO_KEY_VALUE = 4;

const metodos = {
  reservar: id => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Reservar/" + id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  asignar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Asignar/" + comando.idUsuario;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  completar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Completar";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  cancelar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Cancelar";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        },
        body: JSON.stringify({ id: comando.idTurno, motivo: comando.motivo })
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  cancelarReserva: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/CancelarReserva";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        },
        body: JSON.stringify({ id: comando.idTurno, motivo: comando.motivo })
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  ponerEnEstadoDisponible: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/PonerEnEstadoDisponible";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  ponerEnEstadoReservado: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/PonerEnEstadoReservado";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getByFilters: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/GetByFilters";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          fechaInicio: comando.fechaInicio,
          fechaFin: comando.fechaFin,
          idTurnero: comando.idTurnero
        })
      })
        .then(data => {
          if (data.ok == false) {
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

          let fechaHoy = new Date().getTime();
          let turnos = data.return;
          _.forEach(turnos, turno => {
            if (turno.estadoKeyValue == ESTADO_DISPONIBLE_KEY_VALUE) {
              let fecha = DateUtils.toDateTime(turno.fecha);
              if (fecha.getTime() < fechaHoy) {
                turno.estadoKeyValue = ESTADO_VENCIDO_KEY_VALUE;
                turno.estadoNombre = "Vencido";
                turno.estadoColor = "#9E9E9E";
              }
            }
          });
          resolve(turnos);
        })
        .catch(({ message }) => {
          reject("Error procesando la solicitud | " + message);
        });
    });
  },
  getDeUsuario: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/GetDeUsuario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          idUsuario: comando.idUsuario,
          idTurnero: comando.idTurnero
        })
      })
        .then(data => {
          if (data.ok == false) {
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

          let fechaHoy = new Date().getTime();
          let turnos = data.return;
          _.forEach(turnos, turno => {
            if (turno.estadoKeyValue == ESTADO_DISPONIBLE_KEY_VALUE) {
              let fecha = DateUtils.toDateTime(turno.fecha);
              if (fecha.getTime() < fechaHoy) {
                turno.estadoKeyValue = ESTADO_VENCIDO_KEY_VALUE;
                turno.estadoNombre = "Vencido";
                turno.estadoColor = "#9E9E9E";
              }
            }
          });
          resolve(turnos);
        })
        .catch(({ message }) => {
          reject("Error procesando la solicitud | " + message);
        });
    });
  },
  getDetalle: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Detalle/" + comando.id;
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
          if (data.ok == false) {
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

          let dataTurno = data.return;
          if (dataTurno.estadoKeyValue == ESTADO_DISPONIBLE_KEY_VALUE) {
            let fecha = DateUtils.toDateTime(dataTurno.fecha);
            if (fecha.getTime() < new Date().getTime()) {
              dataTurno.estadoKeyValue = ESTADO_VENCIDO_KEY_VALUE;
              dataTurno.estadoNombre = "Vencido";
              dataTurno.estadoColor = "#9E9E9E";
            }
          }
          resolve(dataTurno);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getDetalleByCodigo: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Detalle/Codigo/" + comando.codigo + "/" + comando.año;
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
          if (data.ok == false) {
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

          let dataTurno = data.return;
          if (dataTurno.estadoKeyValue == ESTADO_DISPONIBLE_KEY_VALUE) {
            let fecha = DateUtils.toDateTime(dataTurno.fecha);
            if (fecha.getTime() < new Date().getTime()) {
              dataTurno.estadoKeyValue = ESTADO_VENCIDO_KEY_VALUE;
              dataTurno.estadoNombre = "Vencido";
              dataTurno.estadoColor = "#9E9E9E";
            }
          }
          resolve(dataTurno);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  proteger: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Proteger";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  desproteger: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Desproteger";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        }
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getHistorialEstado: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/HistorialEstado/" + comando.id;
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
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getColisionesNuevoTurno: comando => {
    console.log(comando);
    const url = window.Config.WS_TURNERO + "/v1/Turno/ColisionesNuevoTurno";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify({
          idTurnero: comando.idTurnero,
          fecha: comando.fecha,
          protegido: comando.protegido,
          duracion: comando.duracion
        })
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  insertar: comando => {
    console.log(comando);
    const url = window.Config.WS_TURNERO + "/v1/Turno";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify({
          idTurnero: comando.idTurnero,
          fecha: comando.fecha,
          protegido: comando.protegido,
          duracion: comando.duracion
        })
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  agregarNota: comando => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Nota";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurno": comando.idTurno
        },
        body: JSON.stringify({
          contenido: comando.contenido
        })
      })
        .then(data => {
          if (data.ok == false) {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
