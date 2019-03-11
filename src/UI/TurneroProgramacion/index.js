import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import styles from "./styles";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push, goBack } from "connected-react-router";
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";

//Componentes
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Icon, withTheme, List, ListItem, ListItemText, Tooltip, ListItemSecondaryAction } from "@material-ui/core";
import { red, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import BigCalendar from "react-big-calendar";
import _ from "lodash";
import memoize from "memoize-one";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconEditOutlined from "@material-ui/icons/EditOutlined";
import IconAddOutlined from "@material-ui/icons/AddOutlined";
import IconDeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconMoreVertOutlined from "@material-ui/icons/MoreVertOutlined";

//Mis componentes
import DialogoForm from "@Componentes/MiDialogoForm";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";
import MiBaner from "@Componentes/MiBaner";
import DateUtils from "@Componentes/Utils/Date";
import MiSelect from "@Componentes/MiSelect";
import DialogoTurnoDetalle from "../_Dialogos/TurnoDetalle";
import DialogoTurneroEditarDuracion from "../_Dialogos/TurneroEditarDuracion";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";

//Globalizacion
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
const localizer = BigCalendar.momentLocalizer(moment);

const RESOLUCION_RESPETAR_TURNOS = "1";
const RESOLUCION_CANCELAR_TURNOS = "2";

const mapStateToProps = state => {
  return {
    token: state.Usuario.token
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  goBack: () => {
    dispatch(goBack());
  },
  mostrarAlertaVerde: comando => {
    dispatch(mostrarAlertaVerde(comando));
  },
  mostrarAlertaRoja: comando => {
    dispatch(mostrarAlertaRoja(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  }
});

class TurneroNuevoConfigurar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: false,
      cardVisible: false,
      data: undefined,
      //Error
      error: undefined,
      errorVisible: false
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({ id: nextProps.match.params.id }, () => {
        this.buscarDatos();
      });
    }
  }

  buscarDatos = () => {
    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Turnero.getDataConfiguracion(this.state.id)
        .then(data => {
          let detalle = data.detalle;
          let horarioSemanal = _.orderBy(
            data.horarioSemanal,
            [
              function(item) {
                return item.diaKeyValue;
              },
              function(item) {
                return item.horaInicio;
              }
            ],
            ["asc", "asc"]
          );

          var excepciones = data.excepciones;
          var horario = data.horario;
          this.setState({
            cardVisible: true,
            data: detalle,
            horarioSemanal: horarioSemanal,
            excepciones: excepciones,
            dataCalendario: horario
          });
        })
        .catch(error => {
          this.setState({ errorVisible: false, errorMensaje: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onErrorClose = () => {
    this.setState({ errorVisible: false });
  };

  onToolbarTituloClick = () => {
    this.props.redireccionar("/SeleccionarEntidad");
  };

  onBotonHorarioSemanalNuevoClick = () => {
    this.mostrarDialogoHorarioSemanalNuevo();
  };

  mostrarDialogoHorarioSemanalNuevo = () => {
    this.setState({
      dialogoHorarioSemanalNuevoVisible: true,
      dialogoHorarioSemanalNuevoCargando: false,
      dialogoHorarioSemanalNuevoErrorVisible: false
    });
  };

  onDialogoHorarioSemanalNuevoClose = () => {
    const cargando = this.state.dialogoHorarioSemanalNuevoCargando || false;
    if (cargando) return;
    this.setState({ dialogoHorarioSemanalNuevoVisible: false });
  };

  onDialogoHorarioSemanalNuevoBotonSiClick = data => {
    let { dia, inicio, fin, cantidadPuestosTrabajo } = data;
    if (dia == "") {
      this.setState({ dialogoHorarioSemanalNuevoErrorVisible: true, dialogoHorarioSemanalNuevoErrorMensaje: "Seleccione el dia" });
      return;
    }

    if (inicio == "") {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: true,
        dialogoHorarioSemanalNuevoErrorMensaje: "Seleccione el horario de inicio"
      });
      return;
    }

    if (fin == "") {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: true,
        dialogoHorarioSemanalNuevoErrorMensaje: "Seleccione el horario de fin"
      });
      return;
    }

    inicio = inicio.getHours() * 60 + inicio.getMinutes();
    var duracion = fin.getHours() * 60 + fin.getMinutes() - inicio;

    if (duracion <= 0) {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: true,
        dialogoHorarioSemanalNuevoErrorMensaje: "La hora de fin debe ser mayor a la de inicio"
      });
      return;
    }

    // inicio = fechaInicio.getHours() * 60 + fechaInicio.getMinutes();
    // var duracion = fechaFin.getHours() * 60 + fechaFin.getMinutes() - inicio;

    if (cantidadPuestosTrabajo == "") {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: true,
        dialogoHorarioSemanalNuevoErrorMensaje: "Indique la cantidad de puestos de trabajo"
      });
      return;
    }

    if (cantidadPuestosTrabajo <= 0) {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: true,
        dialogoHorarioSemanalNuevoErrorMensaje: "Cantidad de puestos de trabajo inválida"
      });
    }

    this.crearHorarioSemanal({
      dia: dia,
      horaInicio: inicio,
      duracion: duracion,
      cantidadPuestosTrabajo: cantidadPuestosTrabajo
    });
  };

  crearHorarioSemanal = data => {
    data.idTurnero = this.state.id;

    if (this.state.dialogoHorarioSemanalNuevoVisible == true) {
      this.setState({
        dialogoHorarioSemanalNuevoErrorVisible: false,
        dialogoHorarioSemanalNuevoCargando: true
      });
    } else {
      this.setState({
        cargando: true
      });
    }

    Rules_Turnero.agregarHorarioAtencion(data)
      .then(() => {
        this.props.mostrarAlertaVerde({ texto: "Horario semanal registrado correctamente" });

        this.setState({ dialogoHorarioSemanalNuevoCargando: false, cargando: false }, () => {
          this.onDialogoHorarioSemanalNuevoClose();
          this.buscarDatos();
        });
      })
      .catch(error => {
        if (this.state.cargando == true) {
          this.props.mostrarAlertaRoja({ texto: error });
        }

        this.setState({
          cargando: false,
          dialogoHorarioSemanalNuevoCargando: false,
          dialogoHorarioSemanalNuevoErrorVisible: true,
          dialogoHorarioSemanalNuevoErrorMensaje: error
        });
      });
  };

  onDialogoHorarioSemanalNuevoBotonErrorClick = () => {
    this.setState({
      dialogoHorarioSemanalNuevoErrorVisible: false
    });
  };

  onBotonHorarioSemanalBorrarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;
    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.borrarHorarioAtencion({ idTurnero: this.state.id, id: id })
          .then(() => {
            this.buscarDatos();
          })
          .catch(() => {
            this.setState({
              cargando: false
            });
          });
      }
    );
  };

  onBotonHorarioSemanalMenuClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;
    this.setState({ menuHorarioSemanalTarget: e.currentTarget, menuHorarioSemanalId: id });
  };

  onMenuHorarioSemanalClose = () => {
    this.setState({ menuHorarioSemanalTarget: undefined });
  };

  onMenuHorarioSemanalBotonReplicarClick = () => {
    var target = this.state.menuHorarioSemanalTarget;

    this.setState({ menuHorarioSemanalReplicarTarget: target }, () => {
      this.onMenuHorarioSemanalClose();
    });
  };

  onMenuHorarioSemanalReplicarClose = () => {
    this.setState({ menuHorarioSemanalReplicarTarget: undefined });
  };

  onMenuHorarioSemanalReplicarDiaClick = e => {
    var dia = e.currentTarget.attributes["data-value"].value;
    var idReplicar = this.state.menuHorarioSemanalId;

    var data = _.find(this.state.horarioSemanal, item => {
      return item.id == idReplicar;
    });

    this.setState({ menuHorarioSemanalReplicarTarget: undefined });
    this.crearHorarioSemanal({
      dia: dia,
      horaInicio: data.horaInicio,
      duracion: data.duracion,
      cantidadPuestosTrabajo: data.cantidadPuestosTrabajo
    });
  };

  onBotonExcepcionNuevoClick = () => {
    this.mostrarDialogoExcepcionNuevo();
  };

  mostrarDialogoExcepcionNuevo = () => {
    this.setState({
      dialogoExcepcionNuevoVisible: true,
      dialogoExcepcionNuevoCargando: false,
      dialogoExcepcionNuevoErrorVisible: false,
      dialogoExcepcionNuevoTrabaja: "1"
    });
  };

  onDialogoExcepcionNuevoClose = () => {
    const cargando = this.state.dialogoExcepcionNuevoCargando || false;
    if (cargando) return;
    this.setState({ dialogoExcepcionNuevoVisible: false });
  };

  onDialogoExcepcionNuevoBotonSiClick = data => {
    let { fecha, inicio, trabaja, fin, cantidadPuestosTrabajo } = data;
    if (fecha == "") {
      this.setState({ dialogoExcepcionNuevoErrorVisible: true, dialogoExcepcionNuevoErrorMensaje: "Seleccione la fecha de la excepcion" });
      return;
    }

    if (trabaja == "1") {
      if (inicio == "") {
        this.setState({
          dialogoExcepcionNuevoErrorVisible: true,
          dialogoExcepcionNuevoErrorMensaje: "Seleccione el horario de inicio"
        });
        return;
      }

      if (fin == "") {
        this.setState({
          dialogoExcepcionNuevoErrorVisible: true,
          dialogoExcepcionNuevoErrorMensaje: "Seleccione el horario de fin"
        });
        return;
      }

      inicio = inicio.getHours() * 60 + inicio.getMinutes();
      var duracion = fin.getHours() * 60 + fin.getMinutes() - inicio;

      if (duracion <= 0) {
        this.setState({
          dialogoExcepcionNuevoErrorVisible: true,
          dialogoExcepcionNuevoErrorMensaje: "La hora de fin debe ser mayor a la de inicio"
        });
        return;
      }

      if (cantidadPuestosTrabajo == "") {
        this.setState({
          dialogoExcepcionNuevoErrorVisible: true,
          dialogoExcepcionNuevoErrorMensaje: "Indique la cantidad de puestos de trabajo"
        });
        return;
      }

      if (cantidadPuestosTrabajo <= 0) {
        this.setState({
          dialogoExcepcionNuevoErrorVisible: true,
          dialogoExcepcionNuevoErrorMensaje: "Cantidad de puestos de trabajo inválida"
        });
      }
    }

    this.setState(
      {
        dialogoExcepcionNuevoErrorVisible: false,
        dialogoExcepcionNuevoCargando: true
      },
      () => {
        var horarioAtencion = null;
        if (trabaja == 1) {
          horarioAtencion = {
            horaInicio: inicio,
            duracion: duracion,
            cantidadPuestosTrabajo: cantidadPuestosTrabajo
          };
        }
        Rules_Turnero.agregarExcepcion({
          idTurnero: this.state.id,
          fecha: DateUtils.toDateString(fecha),
          horarioAtencion: horarioAtencion
        })
          .then(() => {
            this.setState({ dialogoExcepcionNuevoCargando: false }, () => {
              this.onDialogoExcepcionNuevoClose();
              this.buscarDatos();
            });
          })
          .catch(error => {
            this.setState({
              dialogoExcepcionNuevoCargando: false,
              dialogoExcepcionNuevoErrorVisible: true,
              dialogoExcepcionNuevoErrorMensaje: error
            });
          });
      }
    );
  };

  onBotonExcepcionBotonBorrarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;

    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.borrarExcepcion({ idTurnero: this.state.id, id: id })
          .then(() => {
            this.buscarDatos();
          })
          .catch(() => {
            this.setState({
              cargando: false
            });
          });
      }
    );
  };

  onBotonExcepcionHorarioBotonBorrarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;

    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.borrarExcepcionHorario({ idTurnero: this.state.id, id: id })
          .then(() => {
            this.buscarDatos();
          })
          .catch(() => {
            this.setState({
              cargando: false
            });
          });
      }
    );
  };

  //Dialogo descartar
  onBotonDescartarTurneroClick = () => {
    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.getCantidadTurnosReservados(this.state.id)
          .then(cantidad => {
            let mensaje = "";

            if (cantidad == 0) {
              mensaje = "¿Esta seguro que desea descartar el turnero? Esta accion no se puede deshacer.";
            } else {
              if (cantidad == 1) {
                mensaje =
                  "El turnero tiene 1 turno ya reservado. Si descarta el turnero el turno se cancelará. ¿Desea continuar? Esta acción no se puede deshacer.";
              } else {
                mensaje =
                  "El turnero tiene " +
                  cantidad +
                  " turnos ya reservados. Si descarta el turnero los turnos se cancelarán. ¿Desea continuar? Esta acción no se puede deshacer.";
              }
            }
            this.setState({ dialogoDescartarTurneroMensaje: mensaje }, () => {
              this.mostrarDialogoDescartarTurnero();
            });
          })
          .catch(error => {
            this.props.mostrarAlertaRoja({ texto: error });
          })
          .finally(() => {
            this.setState({ cargando: false });
          });
      }
    );
  };

  mostrarDialogoDescartarTurnero = () => {
    this.setState({
      dialogoDescartarTurneroErrorVisible: false,
      dialogoDescartarTurneroCargando: false,
      dialogoDescartarTurneroVisible: true
    });
  };

  onDialogoDescartarTurneroClose = () => {
    let cargando = this.state.dialogoDescartarTurneroCargando || false;
    if (cargando) return;

    this.setState({
      dialogoDescartarTurneroVisible: false
    });
  };

  onDialogoDescartarTurneroBotonSiClick = () => {
    this.setState(
      {
        dialogoDescartarTurneroErrorVisible: false,
        dialogoDescartarTurneroCargando: true
      },
      () => {
        Rules_Turnero.borrar(this.state.id)
          .then(() => {
            this.setState(
              {
                dialogoDescartarTurneroCargando: false
              },
              () => {
                this.onDialogoDescartarTurneroClose();
                this.props.mostrarAlertaVerde({ texto: "Turnero descartado" });
                this.irListaTurnerosDeTramite();
              }
            );
          })
          .catch(error => {
            this.setState({
              dialogoDescartarTurneroErrorVisible: true,
              dialogoDescartarTurneroErrorMensaje: error,
              dialogoDescartarTurneroCargando: false
            });
          });
      }
    );
  };

  onDialogoDescartarTurneroBotonErrorClose = () => {
    this.setState({ dialogoDescartarTurneroErrorVisible: false });
  };

  //Dialogo Publicar turnero
  onBotonPublicarTurneroClick = () => {
    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.simularGeneracionTurnos(this.state.id)
          .then(data => {
            this.setState(
              {
                dataPublicar: data,
                dialogoPublicarTurneroMensaje:
                  "¿Esta seguro que desea publicar el tunero? Al hacerlo los usuarios podrán verlo y reservar turnos."
              },
              () => {
                this.mostrarDialogoPublicarTurnero();
              }
            );
          })
          .catch(error => {
            this.props.mostrarAlertaRoja({ texto: error });
          })
          .finally(() => {
            this.setState({ cargando: false });
          });
      }
    );
  };

  mostrarDialogoPublicarTurnero = () => {
    this.setState({
      dialogoPublicarTurneroVisible: true,
      dialogoPublicarTurneroErrorVisible: false,
      dialogoPublicarTurneroCargando: false,
      dialogoPublicarTurneroVerTurnosDentroDeRango: false,
      dialogoPublicarTurneroTurnosDentroDeRangoAccion: RESOLUCION_RESPETAR_TURNOS,
      dialogoPublicarTurneroVerTurnosFueraDeRango: false,
      dialogoPublicarTurneroTurnosFueraDeRangoAccion: RESOLUCION_RESPETAR_TURNOS
    });
  };

  onDialogoPublicarTurneroClose = () => {
    let cargando = this.state.dialogoPublicarTurneroCargando || false;
    if (cargando) return;
    this.setState({
      dialogoPublicarTurneroVisible: false
    });
  };

  onDialogoPublicarTurneroBotonSiClick = () => {
    this.setState(
      {
        dialogoPublicarTurneroCargando: true,
        dialogoPublicarTurneroErrorVisible: false
      },
      () => {
        Rules_Turnero.publicar({
          idTurnero: this.state.id,
          resolucionTurnosDentroDeRango: parseInt(this.state.dialogoPublicarTurneroTurnosDentroDeRangoAccion),
          resolucionTurnosFueraDeRango: parseInt(this.state.dialogoPublicarTurneroTurnosFueraDeRangoAccion),
          generarTurnos: true
        })
          .then(() => {
            this.setState(
              {
                dialogoPublicarTurneroCargando: false
              },
              () => {
                this.onDialogoPublicarTurneroClose();
                this.irListaTurnerosDeTramite();
                this.props.mostrarAlertaVerde({ texto: "Turnero publicado correctamente" });
              }
            );
          })
          .catch(error => {
            this.setState({
              dialogoPublicarTurneroErrorVisible: true,
              dialogoPublicarTurneroErrorMensaje: error,
              dialogoPublicarTurneroCargando: false
            });
          });
      }
    );
  };

  irListaTurnerosDeTramite = () => {
    var idEntidad = this.state.data.entidadId;
    var idTramite = this.state.data.tramiteId;
    this.props.redireccionar("/Tramite/" + idEntidad + "/" + idTramite);
  };

  onDialogoPublicarTurneroBotonErrorClose = () => {
    this.setState({ dialogoPublicarTurneroErrorVisible: false });
  };

  onDialogoPublicarTurneroTurnosDentroDeRangoAccionChange = e => {
    if (e == undefined || e.value == -1) {
      this.setState({ dialogoPublicarTurneroTurnosDentroDeRangoAccion: undefined });
      return;
    }
    this.setState({ dialogoPublicarTurneroTurnosDentroDeRangoAccion: e.value });
  };

  onDialogoPublicarTurneroTurnosFueraDeRangoAccionChange = e => {
    if (e == undefined || e.value == -1) {
      this.setState({ dialogoPublicarTurneroTurnosFueraDeRangoAccion: undefined });
      return;
    }
    this.setState({ dialogoPublicarTurneroTurnosFueraDeRangoAccion: e.value });
  };

  onDialogoPublicarTurneroTurnosFueraDeRangoToggleClick = () => {
    this.setState({
      dialogoPublicarTurneroVerTurnosFueraDeRango: !(this.state.dialogoPublicarTurneroVerTurnosFueraDeRango || false)
    });
  };

  onDialogoPublicarTurneroTurnosDentroDeRangoToggleClick = () => {
    this.setState({
      dialogoPublicarTurneroVerTurnosDentroDeRango: !(this.state.dialogoPublicarTurneroVerTurnosDentroDeRango || false)
    });
  };

  onDialogoPublicarTurneroBotonTurnoClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoTurnoDetalle(id);
  };

  onDialogoPublicarTurneroBotonPublicarSinTurnosClick = () => {
    this.setState(
      {
        dialogoPublicarTurneroCargando: true,
        dialogoPublicarTurneroErrorVisible: false
      },
      () => {
        Rules_Turnero.publicar({
          idTurnero: this.state.id,
          resolucionTurnosDentroDeRango: parseInt(this.state.dialogoPublicarTurneroTurnosDentroDeRangoAccion),
          resolucionTurnosFueraDeRango: parseInt(this.state.dialogoPublicarTurneroTurnosFueraDeRangoAccion),
          generarTurnos: false
        })
          .then(() => {
            this.setState(
              {
                dialogoPublicarTurneroCargando: false
              },
              () => {
                this.onDialogoPublicarTurneroClose();
                var idEntidad = this.state.data.entidadId;
                var idTramite = this.state.data.tramiteId;
                this.props.mostrarAlertaVerde({ texto: "Turnero publicado correctamente" });
                this.props.redireccionar("/Tramite/" + idEntidad + "/" + idTramite);
              }
            );
          })
          .catch(error => {
            this.setState({
              dialogoPublicarTurneroErrorVisible: true,
              dialogoPublicarTurneroErrorMensaje: error,
              dialogoPublicarTurneroCargando: false
            });
          });
      }
    );
  };

  //Dialogo turno detalle
  mostrarDialogoTurnoDetalle = id => {
    this.setState({
      dialogoTurnoDetalleVisible: true,
      dialogoTurnoDetalleId: id
    });
  };

  onDialogoTurnoDetalleClose = modificado => {
    if (modificado) {
      this.onDialogoPublicarTurneroClose();
      this.onBotonPublicarTurneroClick();
    }

    this.setState({ dialogoTurnoDetalleVisible: false });
  };

  //Eventos
  eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.color;
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "8px",
      // opacity: 0.8,
      // width:'90%',
      color: "white",
      border: "4px solid white",
      display: "block",
      "& *": {
        color: "white"
      }
    };
    return {
      style: style
    };
  };

  getEventos = memoize((dataCalendario, excepciones) => {
    if (dataCalendario == undefined || excepciones == undefined) return [];
    return dataCalendario.map((h, index) => {
      var inicio = DateUtils.toDateTime(h.fecha);
      inicio.setMinutes(h.horaInicio);

      var fin = DateUtils.toDateTime(h.fecha);
      fin.setMinutes(h.horaInicio + h.duracion);

      var titulo = `${DateUtils.toDateString(inicio)}`;
      var descripcion = h.cantidadPuestosTrabajo + " empleados";

      var esExcepcion =
        _.find(excepciones, a => {
          var a1 = a.fecha;
          var a2 = h.fecha;
          var iguales = a1 == a2;
          return iguales;
        }) != undefined;

      return {
        id: index,
        color: esExcepcion ? "rgba(100,100,100,1)" : "green",
        titulo: titulo,
        descripcion: descripcion,
        esExcepcion: esExcepcion,
        start: inicio,
        end: fin
      };
    });
  });

  onBotonTramiteClick = () => {
    debugger;
    this.irListaTurnerosDeTramite();
  };

  //Editar turnero
  onBotonEditarClick = () => {
    this.mostrarDialogoTurneroEditar();
  };

  mostrarDialogoTurneroEditar = () => {
    this.setState({ dialogoTurneroEditarVisible: true });
  };

  onDialogoTuneroEditarClose = turnero => {
    this.setState({ dialogoTurneroEditarVisible: false });

    if (turnero != undefined) {
      this.buscarDatos();
    }
  };

  //Borrador
  onBotonBorradorClick = () => {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.setBorrador(this.state.data.id)
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turnero en borrador" });
          this.buscarDatos();
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
          this.setState({ cargando: false });
        });
    });
  };

  render() {
    const { classes } = this.props;
    const { cargando, data } = this.state;

    var breadcrumbs = [];
    if (data) {
      breadcrumbs.push({
        titulo: "Entidad",
        texto: data.entidadNombre,
        url: "/Entidad/" + data.entidadId
      });
      breadcrumbs.push({
        titulo: "Trámite",
        texto: data.tramiteNombre,
        url: "/Tramite/" + data.entidadId + "/" + data.tramiteId
      });
      breadcrumbs.push({
        titulo: "Turnero",
        texto: data.nombre,
        url: ""
      });
    }

    return (
      <_MiPagina
        cargando={cargando}
        breadcrumbs={breadcrumbs}
        onToolbarTituloClick={this.onToolbarTituloClick}
        full={true}
        miContentRootClassName={classes.content}
      >
        <div>
          {this.renderEncabezado()}
          {this.renderContent()}
        </div>

        {this.renderDialogos()}
      </_MiPagina>
    );
  }

  renderEncabezado() {
    const { classes } = this.props;
    const { data, errorVisible, errorMensaje } = this.state;

    return (
      <React.Fragment>
        <MiBaner
          visible={errorVisible || false}
          modo="error"
          mensaje={errorMensaje || ""}
          className={classes.contenedorError}
          botonVisible={true}
          onBotonClick={this.onErrorClose}
        />
      </React.Fragment>
    );
  }

  renderContent() {
    const { classes, theme } = this.props;
    const { data, cardVisible, horarioSemanal, excepciones, dataCalendario } = this.state;

    let nombre = "";
    let fechaInicio = "";
    let fechaFin = "";
    let duracionTurno = "";
    if (data) {
      nombre = data.nombre || "";
      fechaInicio = DateUtils.toDateString(DateUtils.toDateTime(data.fechaInicio));
      fechaFin = DateUtils.toDateString(DateUtils.toDateTime(data.fechaFin));
      duracionTurno = data.duracionTurno + " min";
    }

    let eventos = this.getEventos(dataCalendario, excepciones);

    return (
      <MiCard rootClassName={classNames(classes.card, cardVisible && "visible")} padding={false}>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              width: "500px",
              display: "flex",
              flexDirection: "column",
              zIndex: 10,
              boxShadow: theme.shadows[4]
            }}
          >
            <div style={{ backgroundColor: "rgba(0,0,0,0.025)", padding: "16px" }}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Typography variant="title">{nombre}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <div style={{ display: "flex" }}>
                    <div>
                      <Typography variant="body1">
                        Desde <b>{fechaInicio}</b> hasta <b>{fechaFin}</b>
                      </Typography>
                      <Typography variant="body1">{`Duracion de turno: ${duracionTurno}`}</Typography>
                    </div>
                    {data && data.publicado == false && (
                      <Button color="primary" onClick={this.onBotonEditarClick} style={{ marginLeft: 16 }}>
                        <IconEditOutlined style={{ marginRight: 8 }} />
                        Editar duración
                      </Button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>

            <div style={{ padding: 16, flex: 1, overflow: "auto" }}>
              <Grid container spacing={16}>
                {/* Horario semanal */}
                <Grid item xs={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="title">Horario semanal</Typography>
                    {data && data.publicado == false && (
                      <Button color="primary" style={{ marginLeft: 16 }} onClick={this.onBotonHorarioSemanalNuevoClick}>
                        <IconAddOutlined />
                        Nuevo
                      </Button>
                    )}
                  </div>
                  <div className={classes.contenedorHorarioSemanal}>
                    {horarioSemanal &&
                      horarioSemanal.map((horario, index) => {
                        const horaInicio = DateUtils.transformarDuracion(horario.horaInicio);
                        const horaFin = DateUtils.transformarDuracion(horario.horaInicio + horario.duracion);

                        return (
                          <div className={classes.horarioSemanal} key={index}>
                            <div className={"textos"}>
                              <Typography variant="body2">{horario.diaNombre}</Typography>
                              <Typography variant="body1">{`Desde ${horaInicio} hasta ${horaFin}`}</Typography>
                              <Typography variant="body1">{`${horario.cantidadPuestosTrabajo} puestos de trabajo`}</Typography>
                            </div>
                            {data && data.publicado == false && (
                              <div className="contenedorBotones">
                                <IconButton className="boton" data-id={horario.id} onClick={this.onBotonHorarioSemanalBorrarClick}>
                                  <IconDeleteOutlined />
                                </IconButton>
                                <IconButton className="boton" data-id={horario.id} onClick={this.onBotonHorarioSemanalMenuClick}>
                                  <IconMoreVertOutlined />
                                </IconButton>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </Grid>

                {/* Excepciones */}
                <Grid item xs={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="title">Excepciones</Typography>

                    {data && data.publicado == false && (
                      <Button color="primary" style={{ marginLeft: 16 }} onClick={this.onBotonExcepcionNuevoClick}>
                        <IconAddOutlined />
                        Nuevo
                      </Button>
                    )}
                  </div>
                  <div className={classes.contenedorExcepciones}>
                    {excepciones &&
                      excepciones.map((excepcion, indexExcepcion) => {
                        const fecha = DateUtils.toDateString(DateUtils.toDate(excepcion.fecha));

                        return (
                          <div className={classes.excepcion} key={indexExcepcion}>
                            <div className={"textos"}>
                              <Typography variant="body2">{fecha}</Typography>
                              {excepcion.horarios &&
                                excepcion.horarios.length != 0 &&
                                excepcion.horarios.map(horario => {
                                  const horaInicio = DateUtils.transformarDuracion(horario.horaInicio);
                                  const horaFin = DateUtils.transformarDuracion(horario.horaInicio + horario.duracion);

                                  return (
                                    <div className="horario">
                                      <div className="textos">
                                        <Typography variant="body1">{`Desde ${horaInicio} hasta ${horaFin}`}</Typography>
                                        <Typography variant="body1">{`${horario.cantidadPuestosTrabajo} puestos de trabajo`}</Typography>{" "}
                                      </div>
                                      {data && data.publicado == false && (
                                        <IconButton
                                          className="boton"
                                          data-id={horario.id}
                                          onClick={this.onBotonExcepcionHorarioBotonBorrarClick}
                                        >
                                          <IconDeleteOutlined />
                                        </IconButton>
                                      )}
                                    </div>
                                  );
                                })}

                              {!excepcion.horarios ||
                                (excepcion.horarios.length == 0 && <Typography variant="body1">{`No trabaja en todo el dia`}</Typography>)}
                            </div>
                            {data && data.publicado == false && (
                              <div className="contenedorBotones">
                                <IconButton className="boton" data-id={excepcion.id} onClick={this.onBotonExcepcionBotonBorrarClick}>
                                  <IconDeleteOutlined />
                                </IconButton>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </Grid>
              </Grid>
            </div>

            <div style={{ padding: 16 }}>
              <Grid container spacing={16}>
                {data && data.publicado == false && (
                  <React.Fragment>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        className="boton"
                        variant="outlined"
                        style={{ color: red["600"], borderColor: red["600"] }}
                        onClick={this.onBotonDescartarTurneroClick}
                      >
                        Eliminar turnero
                      </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        className="boton"
                        variant="outlined"
                        style={{ color: green["600"], borderColor: green["600"] }}
                        onClick={this.onBotonPublicarTurneroClick}
                      >
                        Publicar turnero
                      </Button>
                    </Grid>
                  </React.Fragment>
                )}

                {data && data.publicado == true && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      className="boton"
                      variant="outlined"
                      style={{ color: green["600"], borderColor: green["600"] }}
                      onClick={this.onBotonBorradorClick}
                    >
                      Poner en borrador
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <BigCalendar
              // showMultiDayTimes
              defaultView={"week"}
              views={["week"]}
              eventPropGetter={this.eventStyleGetter}
              className={classNames(classes.calendario)}
              culture="es"
              localizer={localizer}
              components={{
                event: props => {
                  return <MiEvento data={props} />;
                }
              }}
              events={eventos || []}
            />
          </div>
        </div>
      </MiCard>
    );
  }

  renderDialogos() {
    return (
      <React.Fragment>
        {this.renderDialogoHorarioSemanalNuevo()}
        {this.renderDialogoExcepcionNuevo()}
        {this.renderMenuMenuSemanal()}
        {this.renderMenuMenuSemanalReplicar()}
        {this.renderDialogoDescartarTurnero()}
        {this.renderDialogoPublicarTurnero()}
        {this.renderDialogoTurnoDetalle()}
        {this.renderDialogoTurneroEditar()}
      </React.Fragment>
    );
  }

  renderDialogoHorarioSemanalNuevo() {
    const inputDialogoHorarioSemanal = [
      {
        inputType: "radio",
        key: "dia",
        label: "Dia de la semana",
        horizontal: true,
        items: [
          {
            value: "1",
            label: "Lunes"
          },
          {
            value: "2",
            label: "Martes"
          },
          {
            value: "3",
            label: "Miercoles"
          },
          {
            value: "4",
            label: "Jueves"
          },
          {
            value: "5",
            label: "Viernes"
          },
          {
            value: "6",
            label: "Sábado"
          },
          {
            value: "7",
            label: "Domingo"
          }
        ]
      },
      {
        key: "inicio",
        type: "time",
        label: "Hora de inicio"
      },
      {
        key: "fin",
        type: "time",
        label: "Hora de fin"
      },
      {
        key: "cantidadPuestosTrabajo",
        type: "number",
        label: "Cantidad de empleados"
      }
    ];

    return (
      <DialogoForm
        titulo="Nuevo horario semanal"
        visible={this.state.dialogoHorarioSemanalNuevoVisible || false}
        cargando={this.state.dialogoHorarioSemanalNuevoCargando || false}
        banerVisible={this.state.dialogoHorarioSemanalNuevoErrorVisible || false}
        banerMensaje={this.state.dialogoHorarioSemanalNuevoErrorMensaje || ""}
        banerBotonVisible={true}
        onBanerBotonClick={this.onDialogoHorarioSemanalNuevoBotonErrorClick}
        onClose={this.onDialogoHorarioSemanalNuevoClose}
        inputs={inputDialogoHorarioSemanal}
        textoSi="Registrar"
        textoNo="Cancelar"
        onBotonSiClick={this.onDialogoHorarioSemanalNuevoBotonSiClick}
        autoCerrarBotonSi={false}
      />
    );
  }

  renderDialogoExcepcionNuevo() {
    const inputs = [
      {
        key: "fecha",
        type: "date",
        label: "Fecha"
      },
      {
        key: "trabaja",
        inputType: "radio",
        horizontal: true,
        value: "1",
        label: "Trabaja",
        onChange: a => {
          this.setState({
            dialogoExcepcionNuevoTrabaja: a.currentTarget.value
          });
        },
        items: [
          {
            value: "1",
            label: "Si"
          },
          {
            value: "2",
            label: "No"
          }
        ]
      }
    ];

    if (this.state.dialogoExcepcionNuevoTrabaja == "1") {
      inputs.push({
        key: "inicio",
        type: "time",
        label: "Hora de inicio"
      });
      inputs.push({
        key: "fin",
        type: "time",
        label: "Hora de fin"
      });
      inputs.push({
        key: "cantidadPuestosTrabajo",
        type: "number",
        label: "Cantidad de empleados"
      });
    }

    return (
      <DialogoForm
        titulo="Nueva excepcion"
        visible={this.state.dialogoExcepcionNuevoVisible || false}
        cargando={this.state.dialogoExcepcionNuevoCargando || false}
        banerVisible={this.state.dialogoExcepcionNuevoErrorVisible || false}
        banerMensaje={this.state.dialogoExcepcionNuevoErrorMensaje || ""}
        banerBotonVisible={true}
        onBanerBotonClick={this.onDialogoExcepcionNuevoBotonErrorClick}
        onClose={this.onDialogoExcepcionNuevoClose}
        inputs={inputs}
        textoSi="Registrar"
        textoNo="Cancelar"
        onBotonSiClick={this.onDialogoExcepcionNuevoBotonSiClick}
        autoCerrarBotonSi={false}
      />
    );
  }

  renderMenuMenuSemanal() {
    const { menuHorarioSemanalTarget } = this.state;

    return (
      <Menu
        id="simple-menu"
        anchorEl={menuHorarioSemanalTarget}
        open={Boolean(menuHorarioSemanalTarget)}
        onClose={this.onMenuHorarioSemanalClose}
      >
        <MenuItem onClick={this.onMenuHorarioSemanalBotonReplicarClick}>Replicar para otro dia</MenuItem>
      </Menu>
    );
  }

  renderMenuMenuSemanalReplicar() {
    const { menuHorarioSemanalReplicarTarget } = this.state;

    return (
      <Menu
        id="simple-menu"
        anchorEl={menuHorarioSemanalReplicarTarget}
        open={Boolean(menuHorarioSemanalReplicarTarget)}
        onClose={this.onMenuHorarioSemanalReplicarClose}
      >
        <MenuItem data-value="1" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Lunes
        </MenuItem>
        <MenuItem data-value="2" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Martes
        </MenuItem>
        <MenuItem data-value="3" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Miercoles
        </MenuItem>
        <MenuItem data-value="4" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Jueves
        </MenuItem>
        <MenuItem data-value="5" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Viernes
        </MenuItem>
        <MenuItem data-value="6" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Sabado
        </MenuItem>
        <MenuItem data-value="7" onClick={this.onMenuHorarioSemanalReplicarDiaClick}>
          Domingo
        </MenuItem>
      </Menu>
    );
  }

  renderDialogoDescartarTurnero() {
    return (
      <DialogoMensaje
        visible={this.state.dialogoDescartarTurneroVisible || false}
        onClose={this.onDialogoDescartarTurneroClose}
        cargando={this.state.dialogoDescartarTurneroCargando || false}
        banerVisible={this.state.dialogoDescartarTurneroErrorVisible || false}
        banerMensaje={this.state.dialogoDescartarTurneroErrorMensaje || ""}
        banerBotonVisible={true}
        onBanerBotonClick={this.onDialogoDescartarTurneroBotonErrorClose}
        titulo="Confirmar descartar turnero"
        mensaje={this.state.dialogoDescartarTurneroMensaje || ""}
        onBotonSiClick={this.onDialogoDescartarTurneroBotonSiClick}
        autoCerrarBotonSi={false}
        textoSi="Descartar turnero"
        textoNo="Cancelar"
      />
    );
  }

  renderDialogoPublicarTurnero() {
    const { classes } = this.props;

    const {
      dataPublicar,
      dialogoPublicarTurneroVerTurnosDentroDeRango,
      dialogoPublicarTurneroVerTurnosFueraDeRango,
      dialogoPublicarTurneroTurnosDentroDeRangoAccion,
      dialogoPublicarTurneroTurnosFueraDeRangoAccion
    } = this.state;

    const turnosDentroDeRango = (dataPublicar && dataPublicar.turnosDentroDeRango) || [];
    const turnosFueraDeRango = (dataPublicar && dataPublicar.turnosFueraDeRango) || [];

    let opciones = [
      {
        value: "1",
        label: "Respetar turnos"
      },
      {
        value: "2",
        label: "Cancelar turnos"
      }
    ];

    return (
      <DialogoMensaje
        visible={this.state.dialogoPublicarTurneroVisible || false}
        onClose={this.onDialogoPublicarTurneroClose}
        cargando={this.state.dialogoPublicarTurneroCargando || false}
        banerVisible={this.state.dialogoPublicarTurneroErrorVisible || false}
        banerMensaje={this.state.dialogoPublicarTurneroErrorMensaje || ""}
        banerBotonVisible={true}
        onBanerBotonClick={this.onDialogoPublicarTurneroBotonErrorClose}
        titulo="Confirmar publicar turnero"
        mensaje={this.state.dialogoPublicarTurneroMensaje || ""}
        onBotonSiClick={this.onDialogoPublicarTurneroBotonSiClick}
        // autoCerrarBotonSi={false}
        botonSiVisible={false}
        // textoSi="Publicar"
        textoNo="Cancelar"
      >
        {dataPublicar && (
          <div>
            {/* Turnos fuera de rango */}
            {!turnosFueraDeRango ||
              (turnosFueraDeRango.length == 0 && (
                <Grid container spacing={16} style={{ marginTop: "16px", backgroundColor: "rgba(0,0,0,0.025)", borderRadius: "8px" }}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Turnos fuera de rango</Typography>
                    <Typography variant="body1">No hay turnos reservados que estén por fuera de la nueva programación</Typography>
                  </Grid>
                </Grid>
              ))}

            {turnosFueraDeRango && turnosFueraDeRango.length != 0 && (
              <Grid container spacing={16} style={{ marginTop: "16px", backgroundColor: "rgba(0,0,0,0.025)", borderRadius: "8px" }}>
                <Grid item xs={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" style={{ marginRight: "8px" }}>
                      Turnos fuera de rango
                    </Typography>

                    <Button variant="outlined" color="primary" onClick={this.onDialogoPublicarTurneroTurnosFueraDeRangoToggleClick}>
                      {dialogoPublicarTurneroVerTurnosFueraDeRango
                        ? turnosFueraDeRango.length == 1
                          ? "Ocultar el turno"
                          : "Ocultar los turnos"
                        : turnosFueraDeRango.length == 1
                        ? "Ver el turno"
                        : `Ver los ${turnosFueraDeRango.length} turnos`}
                    </Button>
                  </div>
                </Grid>
                {dialogoPublicarTurneroVerTurnosFueraDeRango && (
                  <Grid item xs={12}>
                    <List>
                      {turnosFueraDeRango.map(turno => {
                        return (
                          <ListItem button>
                            <ListItemText>{`${turno.codigo}/${turno.año}`}</ListItemText>
                            <ListItemSecondaryAction>
                              <Button variant="outlined" data-id={turno.id} onClick={this.onDialogoPublicarTurneroBotonTurnoClick}>
                                Ver detalle
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="body1" style={{ marginRight: "8px" }}>
                    Son todos los turnos que ya fueron reservados por algún usuario que se encuentran FUERA del horario del turnero, es
                    decir, que NO se podrían atender dentro del horario configurado.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <MiSelect
                    placeholder="Seleccione..."
                    onChange={this.onDialogoPublicarTurneroTurnosFueraDeRangoAccionChange}
                    fullWidth
                    value={dialogoPublicarTurneroTurnosFueraDeRangoAccion}
                    label="Acción a realizar sobre los turnos"
                    variant="outlined"
                    options={opciones}
                  />
                </Grid>
              </Grid>
            )}

            {/* Turnos dentro de rango */}

            {!turnosDentroDeRango ||
              (turnosDentroDeRango.length == 0 && (
                <Grid container spacing={16} style={{ marginTop: "16px", backgroundColor: "rgba(0,0,0,0.025)", borderRadius: "8px" }}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Turnos dentro de rango</Typography>
                    <Typography variant="body1">No hay turnos reservados dentro de la nueva programación</Typography>
                  </Grid>
                </Grid>
              ))}

            {turnosDentroDeRango && turnosDentroDeRango.length != 0 && (
              <Grid container spacing={16} style={{ marginTop: "16px", backgroundColor: "rgba(0,0,0,0.025)", borderRadius: "8px" }}>
                <Grid item xs={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" style={{ marginRight: "8px" }}>
                      Turnos dentro de rango
                    </Typography>

                    <Button variant="outlined" color="primary" onClick={this.onDialogoPublicarTurneroTurnosDentroDeRangoToggleClick}>
                      {dialogoPublicarTurneroVerTurnosDentroDeRango
                        ? turnosDentroDeRango.length == 1
                          ? "Ocultar el turno"
                          : "Ocultar los turnos"
                        : turnosDentroDeRango.length == 1
                        ? "Ver el turno"
                        : `Ver los ${turnosDentroDeRango.length} turnos`}
                    </Button>
                  </div>
                </Grid>
                {dialogoPublicarTurneroVerTurnosDentroDeRango && (
                  <Grid item xs={12}>
                    <List>
                      {turnosDentroDeRango.map(turno => {
                        return (
                          <ListItem button>
                            <ListItemText>{`${turno.codigo}/${turno.año}`}</ListItemText>
                            <ListItemSecondaryAction>
                              <Button variant="outlined" data-id={turno.id} onClick={this.onDialogoPublicarTurneroBotonTurnoClick}>
                                Ver detalle
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="body1" style={{ marginRight: "8px" }}>
                    Son todos los turnos que ya fueron reservados por algún usuario que se encuentran DENTRO del horario del turnero, es
                    decir, que se podrían atender dentro del horario. Si respeta dichos turnos, tenga en cuenta que quedaran como sobreturno
                    de los turnos creados al publicar este turnero.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <MiSelect
                    placeholder="Seleccione..."
                    onChange={this.onDialogoPublicarTurneroTurnosDentroDeRangoAccionChange}
                    fullWidth
                    value={dialogoPublicarTurneroTurnosDentroDeRangoAccion}
                    label="Acción a realizar sobre los turnos"
                    variant="outlined"
                    options={opciones}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={16} style={{ marginTop: "32px" }}>
              <Grid item xs={6}>
                <Tooltip
                  disableFocusListener={true}
                  title={TEXTO_EXPLICACION_PUBLICAR_TURNERO_SIN_GENERAR}
                  classes={{ tooltip: classes.lightTooltip }}
                >
                  <Button variant="outlined" color="primary" onClick={this.onDialogoPublicarTurneroBotonPublicarSinTurnosClick}>
                    Publicar turnero sin generar turnos
                  </Button>
                </Tooltip>
              </Grid>

              <Grid item xs={6}>
                <Tooltip
                  disableFocusListener={true}
                  title={TEXTO_EXPLICACION_PUBLICAR_TURNERO_Y_GENERAR}
                  classes={{ tooltip: classes.lightTooltip }}
                >
                  <Button variant="outlined" color="primary" onClick={this.onDialogoPublicarTurneroBotonSiClick}>
                    Publicar turnero y generar turnos
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        )}
      </DialogoMensaje>
    );
  }

  renderDialogoTurnoDetalle() {
    const { dialogoTurnoDetalleVisible, dialogoTurnoDetalleId } = this.state;

    return (
      <DialogoTurnoDetalle
        onClose={this.onDialogoTurnoDetalleClose}
        visible={dialogoTurnoDetalleVisible || false}
        idturno={dialogoTurnoDetalleId}
      />
    );
  }

  renderDialogoTurneroEditar() {
    const { dialogoTurneroEditarVisible } = this.state;

    return (
      <DialogoTurneroEditarDuracion
        onClose={this.onDialogoTuneroEditarClose}
        visible={dialogoTurneroEditarVisible || false}
        id={this.state.id}
      />
    );
  }
}

class MiEvento extends React.Component {
  render() {
    const data = this.props.data.event;
    return (
      <div>
        <Typography variant="body2" style={{ color: "white" }}>
          {data.titulo}
        </Typography>
        <Typography variant="body1" style={{ color: "white" }}>
          {data.descripcion}
        </Typography>

        {data.esExcepcion == true && (
          <Typography variant="body2" style={{ color: "white", marginTop: "8px" }}>
            Es excepcion
          </Typography>
        )}
      </div>
    );
  }
}

const TEXTO_EXPLICACION_PUBLICAR_TURNERO_SIN_GENERAR =
  "Se publicará el turnero. Los turnos existentes no sufrirán cambios. No se generará ningun nuevo turno.Si se modificó la programación del turnero posiblemente los turnos existentes no respeten el nuevo horario configurado.";

const TEXTO_EXPLICACION_PUBLICAR_TURNERO_Y_GENERAR =
  "Se publicará el turnero. Los turnos existentes en estado DISPONIBLE se borrarán. Se generarán todos los turnos nuevamente respetando el nuevo horario configurado. Esta acción puede demorar unos minutos.";

let componente = TurneroNuevoConfigurar;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withTheme()(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
