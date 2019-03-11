import _ from "lodash";

const metodos = {
  insertar: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--IdTramite": comando.idTramite,
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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
  actualizarDatosBasicos: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/ActualizarDatosBasicos";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--IdTurnero": comando.id,
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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

  actualizarDatosDuracion: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/ActualizarDatosDuracion";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--IdTurnero": comando.id,
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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
  borrar: id => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--IdTurnero": id,
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
  },
  getDetalle: id => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/Detalle/" + id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
  },
 
  getHorarioSemanal: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/HorarioSemanal?combinar=false";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  agregarHorarioAtencion: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/HorarioSemanal";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarHorarioAtencion: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/HorarioSemanal?id=" + comando.id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  getExcepciones: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/Excepciones";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  agregarExcepcion: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/Excepcion";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarExcepcion: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/Excepcion?id=" + comando.id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  borrarExcepcionHorario: comando => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/ExcepcionHorario?id=" + comando.id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  getHorario: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/Horario";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  getDataConfiguracion: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/DataConfigurarion";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  getCantidadTurnosReservados: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/CantidadTurnosReservados";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  simularGeneracionTurnos: idTurnero => {
    const url = window.Config.WS_TURNERO + "/v1/TurneroPorTramite/SimularGeneracionTurnos";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  publicar: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Publicar`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  setBorrador: id => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Borrador`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": id
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
  //Links
  agregarLink: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/AgregarLink`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarLink: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/BorrarLink?id=${comando.idLink}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  //Requisito
  agregarRequisito: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/AgregarRequisito`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  actualizarRequisito: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/ActualizarRequisito`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarRequisito: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/BorrarRequisito?id=${comando.id}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  agregarRequisitoLink: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/AgregarLinkEnRequisito?idRequisito=${comando.idRequisito}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarRequisitoLink: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/BorrarLinkDeRequisito?idRequisito=${comando.idRequisito}&idLink=${
      comando.idLink
    }`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  //Ubicacion
  setUbicacion: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Ubicacion`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  borrarUbicacion: idTurnero => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Ubicacion`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": idTurnero
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
  //Usuario asociado
  agregarUsuarioAsociado: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/UsuarioAsociado?idUsuario=${comando.idUsuario}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  borrarUsuarioAsociado: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/UsuarioAsociado?idUsuario=${comando.idUsuario}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
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
  exportar: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Exportar`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
  setVisible: comando => {
    const url = `${window.Config.WS_TURNERO}/v1/TurneroPorTramite/Visible?visible=${comando.visible}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--IdTurnero": comando.idTurnero
        },
        body: JSON.stringify(comando)
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
