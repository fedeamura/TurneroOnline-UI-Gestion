import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { mostrarAlertaVerde, mostrarAlertaNaranja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { IconButton, Typography, Grid, FormControlLabel, Checkbox, Tooltip } from "@material-ui/core";
import BigCalendar from "react-big-calendar";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";

import IconKeyboardArrowLeftOutlined from "@material-ui/icons/KeyboardArrowLeftOutlined";
import IconKeyboardArrowRightOutlined from "@material-ui/icons/KeyboardArrowRightOutlined";
import IconLockOutlined from "@material-ui/icons/LockOutlined";
import IconLockOpenOutlined from "@material-ui/icons/LockOpenOutlined";

//Mis Componentes
import _MiPagina from "../_MiPagina";
import MiBaner from "@Componentes/MiBaner";
import MiCard from "@Componentes/MiCard";
import MiTabla from "@Componentes/MiTabla";
import BotonesTabla from "./BotonesTabla";
import DialogoTurnoDetalle from "@UI/_Dialogos/TurnoDetalle";
// import DialogoConfirmacion from "@UI/_Dialogos/Confirmacion";
import DialogoSelectorUsuario from "@UI/_Dialogos/SelectorUsuario";
// import DialogoInput from "@UI/_Dialogos/Input";
import DateUtils from "@Componentes/Utils/Date";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turno from "@Rules/Rules_Turno";
import Rules_Turnero from "@Rules/Rules_Turnero";
import Rules_EstadoTurno from "@Rules/Rules_EstadoTurno";

//Globalizacion
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const localizer = BigCalendar.momentLocalizer(moment);

const ESTADO_VENCIDO_KEY_VALUE = -1;
const ESTADO_DISPONIBLE_KEY_VALUE = 1;
const ESTADO_RESERVADO_KEY_VALUE = 2;
const ESTADO_COMPLETADO_KEY_VALUE = 3;
const ESTADO_CANCELADO_KEY_VALUE = 4;

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    rol: state.Usuario.rol
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  mostrarAlertaVerde: comando => {
    dispatch(mostrarAlertaVerde(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  }
});

class ConsultaTurnos extends React.Component {
  constructor(props) {
    super(props);

    let fechaInicio = new Date();
    fechaInicio.setDate(1);
    fechaInicio.setHours(0);
    fechaInicio.setMinutes(0);
    fechaInicio.setSeconds(0);
    fechaInicio.setMilliseconds(0);

    let fechaFin = new Date();
    fechaFin.setDate(1);
    fechaFin.setMonth(fechaInicio.getMonth() + 1);
    fechaFin.setHours(0);
    fechaFin.setMinutes(0);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    this.state = {
      idTurnero: props.match.params.idTurnero,
      dataTurnero: undefined,
      data: [],
      estados: [],
      fechaCalendario: fechaInicio,
      cargando: false,
      error: undefined,
      mostrarError: false,
      //Filtros
      mostrarFiltros: false,
      filtroEstados: {},
      filtroFechaInicio: fechaInicio,
      filtroFechaFin: fechaFin,
      filtroProtegidos: undefined,
      // Dialogo Turno Detalle
      dialogoTurnoDetalleVisible: false,
      dialogoTurnoDetalleId: undefined,
      //Dialogo Cancelar Reserva
      // dialogoCancelarReservaVisible: false,
      // dialogoCancelarReservaId: undefined,
      //Dialogo selector usuario
      // dialogoSelectorUsuarioVisible: false,
      // asignarUsuarioTurnoId: undefined,
      //Dialogo cancelar turno
      // dialogoCancelarTurnoVisible: false,
      // cancelarTurnoId: undefined,
      //Dialogo completar turno
      // dialogoConfirmacionCompletarTurnoVisible: false,
      // completarTurnoId: undefined,
      //Dialogo seleccionar usuario para busqueda
      dialogoSelectorUsuarioParaBusquedaVisible: false,
      usuarioBusqueda: undefined
    };
  }

  componentDidMount() {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.getDetalle(this.state.idTurnero)
        .then(dataTurnero => {
          Rules_EstadoTurno.get()
            .then(estados => {
              let { filtroEstados } = this.state;
              _.forEach(estados, estado => {
                filtroEstados["" + estado.keyValue] = true;
              });
              this.setState({ estados: estados, filtroEstados: filtroEstados, dataTurnero: dataTurnero });
              this.buscar();
            })
            .catch(error => {
              this.setState({ mostrarError: true, error: error, cargando: false });
            });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error, cargando: false });
        });
    });
  }

  buscar = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.getByFilters({
        idEntidad: this.props.rol.entidadId,
        idTurnero: this.state.idTurnero,
        fechaInicio: DateUtils.toDateString(this.state.filtroFechaInicio),
        fechaFin: DateUtils.toDateString(this.state.filtroFechaFin)
      })
        .then(turnos => {
          turnos.forEach(item => {
            item.fechaDate = DateUtils.toDateTime(item.fecha);
          });

          this.setState({ data: turnos, cardVisible: true });
        })
        .catch(error => {
          this.setState({ error: error, mostrarError: true });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  // cancelarReservaTurno = motivo => {
  //   if (motivo.trim().length == 0) {
  //     this.props.mostrarAlertaNaranja({ texto: "Ingrese el motivo de cancelación de la reserva" });
  //     return;
  //   }
  //   this.onDialogoCancelarReservaTurnoClose();

  //   this.setState({ cargando: true, mostrarError: false }, () => {
  //     Rules_Turno.cancelarReserva({
  //       idEntidad: this.props.rol.entidadId,
  //       idTurno: this.state.dialogoCancelarReservaId,
  //       motivo: motivo.trim()
  //     })
  //       .then(() => {
  //         this.buscar();
  //       })
  //       .catch(error => {
  //         this.setState({ cargando: false, mostrarError: true, error: error });
  //       });
  //   });
  // };

  // asignarUsuario = usuario => {
  //   this.onDialogoSelectorUsuarioClose();

  //   this.setState({ cargando: true, mostrarError: false }, () => {
  //     Rules_Turno.asignar({
  //       idEntidad: this.props.rol.entidadId,
  //       idTurno: this.state.asignarUsuarioTurnoId,
  //       idUsuario: usuario.id
  //     })
  //       .then(() => {
  //         this.props.mostrarAlertaVerde({ texto: "Turno asigando correctamente" });
  //         this.buscar();
  //       })
  //       .catch(error => {
  //         this.setState({ cargando: false, mostrarError: true, error: error });
  //       });
  //   });
  // };

  // cancelarTurno = motivo => {
  //   if (motivo.trim().length == 0) {
  //     this.props.mostrarAlertaNaranja({ texto: "Ingrese el motivo de cancelación" });
  //     return;
  //   }
  //   this.onDialogoCancelarTurnoClose();
  //   this.setState({ cargando: true, mostrarError: false }, () => {
  //     Rules_Turno.cancelar({
  //       idEntidad: this.props.rol.entidadId,
  //       idTurno: this.state.cancelarTurnoId,
  //       motivo: motivo.trim()
  //     })
  //       .then(() => {
  //         this.props.mostrarAlertaVerde({ texto: "Turno cancelado correctamente" });
  //         this.buscar();
  //       })
  //       .catch(error => {
  //         this.setState({ cargando: false, mostrarError: true, error: error });
  //       });
  //   });
  // };

  // completarTurno = () => {
  //   this.setState({ cargando: true, mostrarError: false }, () => {
  //     Rules_Turno.completar({
  //       idEntidad: this.props.rol.entidadId,
  //       idTurno: this.state.completarTurnoId
  //     })
  //       .then(() => {
  //         this.props.mostrarAlertaVerde({ texto: "Turno completado correctamente" });
  //         this.buscar();
  //       })
  //       .catch(error => {
  //         this.setState({ cargando: false, mostrarError: true, error: error });
  //       });
  //   });
  // };

  buscarPorUsuario = usuario => {
    this.setState({ dialogoSelectorUsuarioParaBusquedaVisible: false, cargando: true }, () => {
      Rules_Turno.getDeUsuario({
        idEntidad: this.props.rol.entidadId,
        idTurnero: this.state.idTurnero,
        idUsuario: usuario.id
      })
        .then(data => {
          let { filtroEstados } = this.state;
          filtroEstados[ESTADO_VENCIDO_KEY_VALUE] = false;
          filtroEstados[ESTADO_DISPONIBLE_KEY_VALUE] = false;
          filtroEstados[ESTADO_CANCELADO_KEY_VALUE] = false;
          filtroEstados[ESTADO_RESERVADO_KEY_VALUE] = true;
          filtroEstados[ESTADO_COMPLETADO_KEY_VALUE] = true;

          data.forEach(item => {
            item.fechaDate = DateUtils.toDateTime(item.fecha);
          });

          this.setState({
            usuarioBusqueda: usuario,
            cargando: false,
            data: data,
            filtroEstados: filtroEstados,
            filtroProtegidos: undefined
          });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onBotonFiltrosClick = () => {
    this.setState({ mostrarFiltros: !this.state.mostrarFiltros });
  };

  onBotonMesAnteriorClick = () => {
    let { fechaCalendario } = this.state;
    fechaCalendario.setMonth(fechaCalendario.getMonth() - 1);

    let fechaInicio = new Date(fechaCalendario.getTime());
    fechaInicio.setDate(1);
    fechaInicio.setHours(0);
    fechaInicio.setMinutes(0);
    fechaInicio.setSeconds(0);
    fechaInicio.setMilliseconds(0);

    let fechaFin = new Date(fechaCalendario.getTime());
    fechaFin.setDate(1);
    fechaFin.setMonth(fechaInicio.getMonth() + 1);
    fechaFin.setHours(0);
    fechaFin.setMinutes(0);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    this.setState({
      filtroFechaInicio: fechaInicio,
      filtroFechaFin: fechaFin,
      fechaCalendario: fechaCalendario,
      diaSeleccionado: undefined
    });
    this.buscar();
  };

  onBotonMesSiguienteClick = () => {
    let { fechaCalendario } = this.state;
    fechaCalendario.setMonth(fechaCalendario.getMonth() + 1);

    let fechaInicio = new Date(fechaCalendario.getTime());
    fechaInicio.setDate(1);
    fechaInicio.setHours(0);
    fechaInicio.setMinutes(0);
    fechaInicio.setSeconds(0);
    fechaInicio.setMilliseconds(0);

    let fechaFin = new Date(fechaCalendario.getTime());
    fechaFin.setDate(1);
    fechaFin.setMonth(fechaInicio.getMonth() + 1);
    fechaFin.setHours(0);
    fechaFin.setMinutes(0);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    this.setState({
      filtroFechaInicio: fechaInicio,
      filtroFechaFin: fechaFin,
      fechaCalendario: fechaCalendario,
      diaSeleccionado: undefined
    });
    this.buscar();
  };

  handleCheckboxEstadoChange = e => {
    let filtroEstados = this.state.filtroEstados;
    filtroEstados[e.target.name] = e.target.checked;
    this.setState({ filtroEstados: filtroEstados });
  };

  handleCheckboxFiltroProtegidoChange = e => {
    if (this.state.filtroProtegidos === false) {
      this.setState({ filtroProtegidos: undefined });
      return;
    }
    this.setState({ filtroProtegidos: e.target.checked });
  };

  onDiaClick = dia => {
    if (this.state.fechaCalendario.getMonth() != dia.getMonth()) {
      if (this.state.fechaCalendario.getMonth() < dia.getMonth()) {
        this.onBotonMesSiguienteClick();
      } else {
        this.onBotonMesAnteriorClick();
      }
      this.setState({ diaSeleccionado: dia });
      return;
    }

    if (this.state.diaSeleccionado && this.state.diaSeleccionado.getTime() == dia.getTime()) {
      this.setState({ diaSeleccionado: undefined });
      return;
    }

    let { filtroEstados, estados } = this.state;
    _.forEach(estados, estado => {
      filtroEstados["" + estado.keyValue] = true;
    });
    this.setState({ diaSeleccionado: dia, filtroEstados });
  };

  orderEstado = (a, b) => {
    if (b.data.estadoNombre > a.data.estadoNombre) return 1;
    if (b.data.estadoNombre < a.data.estadoNombre) return -1;
    return 0;
  };

  mostrarDialogoTurnoDetalle = data => {
    this.setState({ dialogoTurnoDetalleVisible: true, dialogoTurnoDetalleId: data.id });
  };

  onDialogoTurnoDetalleClose = turnoModificado => {
    this.setState({ dialogoTurnoDetalleVisible: false });
    if (turnoModificado == true) {
      this.buscar();
    }
  };

  mostrarDialogoCancelarReservaTurno = data => {
    this.setState({
      dialogoCancelarReservaVisible: true,
      dialogoCancelarReservaId: data.id
    });
  };

  onDialogoCancelarReservaTurnoClose = () => {
    this.setState({
      dialogoCancelarReservaVisible: false
    });
  };

  mostrarDialogoSelectorUsuario = data => {
    this.setState({ dialogoSelectorUsuarioVisible: true, asignarUsuarioTurnoId: data.id });
  };

  onDialogoSelectorUsuarioClose = () => {
    this.setState({ dialogoSelectorUsuarioVisible: false });
  };

  mostrarDialogoCancelarTurno = data => {
    this.setState({ dialogoCancelarTurnoVisible: true, cancelarTurnoId: data.id });
  };

  onDialogoCancelarTurnoClose = () => {
    this.setState({ dialogoCancelarTurnoVisible: false });
  };

  mostrarDialogoConfirmacionCompletarTurno = data => {
    this.setState({ dialogoConfirmacionCompletarTurnoVisible: true, completarTurnoId: data.id });
  };

  onDialogoConfirmacionCompletarTurnoClose = () => {
    this.setState({ dialogoConfirmacionCompletarTurnoVisible: false });
  };

  mostrarDialogoSelectorUsuarioParaBusqueda = () => {
    this.setState({ dialogoSelectorUsuarioParaBusquedaVisible: true });
  };

  onDialogoSelectorUsuarioParaBusquedaClose = () => {
    this.setState({ dialogoSelectorUsuarioParaBusquedaVisible: false });
  };

  cancelarBusquedaPorUsuario = () => {
    let { filtroEstados } = this.state;
    filtroEstados[ESTADO_VENCIDO_KEY_VALUE] = true;
    filtroEstados[ESTADO_DISPONIBLE_KEY_VALUE] = true;
    filtroEstados[ESTADO_CANCELADO_KEY_VALUE] = true;
    filtroEstados[ESTADO_RESERVADO_KEY_VALUE] = true;
    filtroEstados[ESTADO_COMPLETADO_KEY_VALUE] = true;
    this.setState({ usuarioBusqueda: undefined, filtroEstados: filtroEstados, filtroProtegidos: undefined }, () => {
      this.buscar();
    });
  };

  onBanerErrorClose = () => {
    this.setState({ mostrarError: false });
  };

  getNombreMes = numero => {
    switch (numero) {
      case 1:
        return "Enero";
      case 2:
        return "Febrero";
      case 3:
        return "Marzo";
      case 4:
        return "Abril";
      case 5:
        return "Mayo";
      case 6:
        return "Junio";
      case 7:
        return "Julio";
      case 8:
        return "Agosto";
      case 9:
        return "Septiembre";
      case 10:
        return "Ocutbre";
      case 11:
        return "Noviembre";
      case 12:
        return "Diciembre";
    }
    return "";
  };

  onBotonQuitarFiltrosClick = () => {
    let { filtroEstados } = this.state;
    filtroEstados[ESTADO_VENCIDO_KEY_VALUE] = true;
    filtroEstados[ESTADO_DISPONIBLE_KEY_VALUE] = true;
    filtroEstados[ESTADO_CANCELADO_KEY_VALUE] = true;
    filtroEstados[ESTADO_RESERVADO_KEY_VALUE] = true;
    filtroEstados[ESTADO_COMPLETADO_KEY_VALUE] = true;

    this.setState({ filtroProtegidos: undefined, usuarioBusqueda: undefined, filtroEstados: filtroEstados, mostrarFiltros: false }, () => {
      this.buscar();
    });
  };

  render() {
    const { classes, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <_MiPagina full cargando={this.state.cargando} toolbarLeftIconVisible={false} onToolbarTituloClick={() => {}}>
          {/* Error */}
          <MiBaner
            mensaje={this.state.error}
            visible={this.state.mostrarError}
            className={classes.contenedorError}
            onClose={this.onBanerErrorClose}
          />

          {/* {this.state.dataTurnero && (
            <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
              <Typography variant="body1">Turnos del turnero</Typography>
              <Typography variant="body2">{this.state.dataTurnero.nombre}</Typography>
              <Typography variant="body1" className={classes.link}>
                Seleccionar otro turnero
              </Typography>
            </div>
          )} */}

          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} md={4} lg={3}>
                  {this.renderCalendario()}

                  {this.state.usuarioBusqueda && (
                    <MiCard className={classes.cardInfoBusquedaPorUsuario}>
                      <Icon>help</Icon>
                      <Typography variant="body1">Mientras esta buscando por usuario, no puede usar el calendario</Typography>
                    </MiCard>
                  )}
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                  {this.renderContenedorTabla()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Dialogo detalle turno */}
          <DialogoTurnoDetalle
            idturno={this.state.dialogoTurnoDetalleId}
            visible={this.state.dialogoTurnoDetalleVisible}
            onClose={this.onDialogoTurnoDetalleClose}
          />

          {/* Dialogo cancelar reserva turno */}
          {/* <DialogoInput
            visible={this.state.dialogoCancelarReservaVisible}
            titulo="Motivo de cancelación de reserva"
            mensaje="Tenga en cuenta que el motivo indicado sera visible por el vecino que solicitó el turno."
            tituloInput="Motivo"
            multiline={true}
            placeholder="Ingrese una descripción..."
            textoSi="Aceptar"
            autoCerrarBotonSi={false}
            textoNo="Cancelar"
            onClose={this.onDialogoCancelarReservaTurnoClose}
            onBotonSiClick={this.cancelarReservaTurno}
          /> */}

          {/* Dialogo selector usuario */}
          {/* <DialogoSelectorUsuario
            visible={this.state.dialogoSelectorUsuarioVisible}
            onClose={this.onDialogoSelectorUsuarioClose}
            onUsuarioSeleccionado={this.asignarUsuario}
          /> */}

          {/* Dialogo cancelar turno */}
          {/* <DialogoInput
            visible={this.state.dialogoCancelarTurnoVisible}
            titulo="Motivo de cancelación de turno"
            mensaje="Tenga en cuenta que el motivo indicado sera visible por el vecino que solicitó el turno."
            tituloInput="Motivo"
            multiline={true}
            placeholder="Ingrese una descripción..."
            textoSi="Aceptar"
            autoCerrarBotonSi={false}
            textoNo="Cancelar"
            onClose={this.onDialogoCancelarTurnoClose}
            onBotonSiClick={this.cancelarTurno}
          /> */}

          {/* Dialogo confirmacion completar turno */}
          {/* <DialogoConfirmacion
            visible={this.state.dialogoConfirmacionCompletarTurnoVisible}
            mensaje="¿Desea completar el turno?"
            onClose={this.onDialogoConfirmacionCompletarTurnoClose}
            onBotonSiClick={this.completarTurno}
          /> */}

          {/* Dialogo selector usuario para busqueda */}
          <DialogoSelectorUsuario
            visible={this.state.dialogoSelectorUsuarioParaBusquedaVisible}
            onClose={this.onDialogoSelectorUsuarioParaBusquedaClose}
            onUsuarioSeleccionado={this.buscarPorUsuario}
          />
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderCalendario() {
    const { classes } = this.props;

    let tieneFiltros = false;
    let filtroEstados = [];
    let conFiltroEstados = false;

    if (this.state.estados.length != 0) {
      for (let filtroEstado in this.state.filtroEstados) {
        if (this.state.filtroEstados[filtroEstado] === true) {
          let estado = _.find(this.state.estados, estado => estado.keyValue == filtroEstado);
          if (estado) {
            filtroEstados.push(estado.nombre);
          }
          // }
        }
      }

      conFiltroEstados = filtroEstados.length != 0 && filtroEstados.length != this.state.estados.length && filtroEstados.length != 0;
      if (this.state.usuarioBusqueda !== undefined && filtroEstados.length === 2) {
        conFiltroEstados = false;
      }

      tieneFiltros =
        this.state.usuarioBusqueda ||
        this.state.diaSeleccionado != undefined ||
        conFiltroEstados ||
        this.state.filtroProtegidos != undefined;
    }

    return (
      <React.Fragment>
        <MiCard padding={false} className={classNames(classes.cardCalendario, this.state.usuarioBusqueda === undefined && "visible")}>
          <BigCalendar
            view="month"
            onView={() => {}}
            onNavigate={() => {}}
            date={this.state.fechaCalendario}
            className={classNames(classes.calendario)}
            views={{ month: true }}
            culture="es"
            localizer={localizer}
            onDrillDown={this.onDiaClick}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            components={{
              month: {
                toolbar: props => {
                  return (
                    <CalendarioMes_Encabezado
                      props={props}
                      classes={classes}
                      onBotonMesAnteriorClick={this.onBotonMesAnteriorClick}
                      onBotonMesSiguienteClick={this.onBotonMesSiguienteClick}
                    />
                  );
                },
                dateHeader: props => {
                  let diaCalendario = props.date;
                  let seleccionado = this.state.diaSeleccionado && DateUtils.esMismoDia(this.state.diaSeleccionado, diaCalendario);

                  let indicadores = [];

                  _.forEach(this.state.estados, estado => {
                    let conTurnosEnEstado = _.find(this.state.data, item => {
                      let fechaTurno = DateUtils.toDateTime(item.fecha);
                      let mismoDia = DateUtils.esMismoDia(fechaTurno, diaCalendario);
                      return item.estadoKeyValue == estado.keyValue && mismoDia == true;
                    });
                    if (conTurnosEnEstado) indicadores.push(conTurnosEnEstado.estadoColor);
                  });

                  if (this.state.usuarioBusqueda) {
                    seleccionado = false;
                    indicadores = [];
                  }

                  return (
                    <CalendarioMes_Dia
                      deshabilitado={false}
                      conTurnos={false}
                      classes={classes}
                      seleccionado={seleccionado}
                      indicadores={indicadores}
                      onClick={this.onDiaClick}
                      props={props}
                    />
                  );
                }
              }
            }}
          />
        </MiCard>
        <MiCard rootClassName={classes.cardFiltrosActivos}>
          <Typography variant="headline">Filtros</Typography>

          {this.state.usuarioBusqueda === undefined && this.state.diaSeleccionado === undefined && (
            <Typography variant="body1">
              <b>Mes: </b> {this.getNombreMes(this.state.fechaCalendario.getMonth() + 1)}
            </Typography>
          )}
          {this.state.usuarioBusqueda === undefined && this.state.diaSeleccionado !== undefined && (
            <Typography variant="body1">
              <b>Dia: </b> {DateUtils.toDateString(this.state.diaSeleccionado)}
            </Typography>
          )}

          {this.state.usuarioBusqueda && (
            <Typography variant="body1">
              <b>Usuario: </b> {`${this.state.usuarioBusqueda.nombre} ${this.state.usuarioBusqueda.apellido}`}
            </Typography>
          )}

          {this.state.filtroProtegidos !== undefined && (
            <Typography variant="body1">
              <b>Protegidos: </b> {this.state.filtroProtegidos === true ? "Si" : "No"}
            </Typography>
          )}

          {conFiltroEstados === true && (
            <Typography variant="body1">
              <b>Estados: </b>
              {filtroEstados.join(", ")}
            </Typography>
          )}

          {tieneFiltros && (
            <div className={classes.contenedorBotones} style={{ marginTop: "16px" }}>
              <Button variant="outlined" color="primary" onClick={this.onBotonQuitarFiltrosClick}>
                Quitar filtros
              </Button>
            </div>
          )}
        </MiCard>
      </React.Fragment>
    );
  }

  renderContenedorTabla() {
    const { classes } = this.props;

    let titulo = "Turnos de " + this.getNombreMes(this.state.fechaCalendario.getMonth() + 1);
    if (this.state.usuarioBusqueda) {
      titulo = `Turnos de ${this.state.usuarioBusqueda.nombre} ${this.state.usuarioBusqueda.apellido}`;
    } else {
      if (this.state.diaSeleccionado) {
        titulo = "Turnos del dia " + DateUtils.toDateString(this.state.diaSeleccionado);
      }
    }

    return (
      <MiCard padding={false} rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
        <div className={classes.contenedorTabla}>
          <div className="main">
            <div className={classes.contenedorTitulo}>
              <Typography variant="title">{titulo}</Typography>

              {/* Boton cancelar busqueda por usuario */}
              {this.state.usuarioBusqueda !== undefined && (
                <IconButton
                  style={{ color: red["500"] }}
                  onClick={this.cancelarBusquedaPorUsuario}
                  className={classNames(classes.botonBusquedaPorUsuario, this.state.mostrarFiltros == false && "visible")}
                >
                  <Icon>clear</Icon>
                </IconButton>
              )}

              {/* Boton buscar por usuario */}
              {this.state.usuarioBusqueda === undefined && (
                <IconButton
                  // color="primary"
                  onClick={this.mostrarDialogoSelectorUsuarioParaBusqueda}
                  className={classNames(classes.botonBusquedaPorUsuario, this.state.mostrarFiltros == false && "visible")}
                >
                  <Icon>search</Icon>
                </IconButton>
              )}

              {/* Filtros */}
              <Button
                // color="primary"
                variant="outlined"
                onClick={this.onBotonFiltrosClick}
                className={classNames(classes.botonFiltro, this.state.mostrarFiltros == false && "visible")}
              >
                <Icon style={{ marginRight: "8px" }}>{"filter_list"}</Icon>
                Filtros
              </Button>
            </div>
            {this.renderTabla()}
          </div>
          {this.renderFiltros()}
        </div>
      </MiCard>
    );
  }

  renderTabla() {
    const { classes } = this.props;

    let cantidadDeEstadosCheckeados = 0;
    for (let filtroEstado in this.state.filtroEstados) {
      if (this.state.filtroEstados[filtroEstado] === true) {
        cantidadDeEstadosCheckeados += 1;
      }
    }

    let dataFiltrada = _.filter(this.state.data, item => {
      let cumpleEstado = cantidadDeEstadosCheckeados === 0 || this.state.filtroEstados[item.estadoKeyValue] == true;
      let cumpleDia =
        this.state.diaSeleccionado == undefined || DateUtils.esMismoDia(this.state.diaSeleccionado, DateUtils.toDateTime(item.fecha));
      let cumpleProtegidos = this.state.filtroProtegidos == undefined || item.protegido == this.state.filtroProtegidos;
      return cumpleEstado && cumpleDia && cumpleProtegidos;
      // return true;
    });

    return (
      <MiTabla
        className={classes.tabla}
        rowHeight={57}
        check={false}
        rowType={"Turnos"}
        columns={[
          { id: "codigo", label: "Codigo", orderBy: this.columnaCodigoOrderBy },
          { id: "fecha", label: "Fecha", orderBy: this.columnaFechaOrderBy },
          { id: "estadoNombre", label: "Estado", orderBy: this.columnaEstadoOrderBy },
          { id: "botones", label: "Acciones" },
          { id: "data", hidden: true }
        ]}
        rows={dataFiltrada.map(item => {
          let fecha = DateUtils.toDate(item.fecha);

          return {
            codigo: this.columnaCodigoRender(item),
            fecha: this.columnaFechaRender(item),
            estadoNombre: this.columnaEstadoRender(item),
            botones: this.columnaBotonesRender(item),
            data: item
          };
        })}
        order="asc"
        orderBy={"fecha"}
      />
    );
  }

  columnaCodigoRender(data) {
    return (
      <Typography
        color="primary"
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={() => {
          this.mostrarDialogoTurnoDetalle(data);
        }}
        variant="body1"
      >{`${data.codigo}/${data.año}`}</Typography>
    );
  }

  columnaCodigoOrderBy(dataA, dataB) {
    let codigoA = dataA.data.codigo;
    let codigoB = dataB.data.codigo;

    if (codigoA > codigoB) {
      return -1;
    }

    if (codigoA < codigoB) {
      return 1;
    }
    return 0;
  }

  columnaFechaRender(data) {
    return <Typography variant="body1">{DateUtils.toDateTimeString(data.fechaDate)}</Typography>;
  }

  columnaFechaOrderBy(dataA, dataB) {
    let valorA = dataA.data.fechaDate;
    let valorB = dataB.data.fechaDate;

    if (valorA > valorB) {
      return -1;
    }

    if (valorA < valorB) {
      return 1;
    }
    return 0;
  }

  columnaEstadoRender(data) {
    const { classes } = this.props;

    return (
      <div className={classes.colEstado}>
        {data.protegido ? (
          <Tooltip title={"Turno protegido"}>
            <IconLockOutlined style={{ color: orange["600"] }} />
          </Tooltip>
        ) : (
          <Tooltip title={"Turno no protegido"}>
            <IconLockOpenOutlined style={{ opacity: 0.4 }} />
          </Tooltip>
        )}
        <div style={{ width: "4px" }} />

        <div className={classes.indicadorEstado} style={{ backgroundColor: data.estadoColor }} />
        <Typography variant="body1">{data.estadoNombre}</Typography>
      </div>
    );
  }

  columnaEstadoOrderBy(dataA, dataB) {
    let valorA = dataA.data.estadoNombre;
    let valorB = dataB.data.estadoNombre;

    if (valorA > valorB) {
      return -1;
    }

    if (valorA < valorB) {
      return 1;
    }
    return 0;
  }

  columnaBotonesRender(data) {
    return (
      <BotonesTabla
        data={data}
        onBotonDetalleClick={this.mostrarDialogoTurnoDetalle}
        onBotonAsignarUsuarioClick={this.mostrarDialogoSelectorUsuario}
        onBotonCancelarReservaClick={this.mostrarDialogoCancelarReservaTurno}
        onBotonCancelarClick={this.mostrarDialogoCancelarTurno}
        onBotonCompletarClick={this.mostrarDialogoConfirmacionCompletarTurno}
        botonAsigarUsuarioVisible={false}
        botonCancelarReservaVisible={false}
        botonCancelarVisible={false}
        botonCompletarVisible={false}
      />
    );
  }

  renderFiltros() {
    const { classes } = this.props;

    let estadosValidosParaBusquedaPorUsuario = [ESTADO_RESERVADO_KEY_VALUE, ESTADO_COMPLETADO_KEY_VALUE];

    return (
      <div className={classNames(classes.contenedorFiltros, this.state.mostrarFiltros && "visible")}>
        <div className={classes.contenedorTitulo}>
          <Typography variant="title">Filtros</Typography>
          <IconButton onClick={this.onBotonFiltrosClick}>
            <Icon>clear</Icon>
          </IconButton>
        </div>

        <div className="content">
          <Typography variant="body2">Estados</Typography>

          {this.state.estados.map((item, index) => {
            let estadoInvalidoParaBusquedaPorUsuario =
              this.state.usuarioBusqueda && estadosValidosParaBusquedaPorUsuario.indexOf(item.keyValue) == -1;
            if (estadoInvalidoParaBusquedaPorUsuario) return null;

            return (
              <div key={index} className={classes.contenedorFiltroEstado}>
                <FormControlLabel
                  disabled={this.state.usuarioBusqueda && estadosValidosParaBusquedaPorUsuario.indexOf(item.keyValue) == -1}
                  control={
                    <div style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
                      <Checkbox
                        disabled={this.state.usuarioBusqueda && estadosValidosParaBusquedaPorUsuario.indexOf(item.keyValue) == -1}
                        name={"" + item.keyValue}
                        checked={this.state.filtroEstados["" + item.keyValue] == true}
                        onChange={this.handleCheckboxEstadoChange}
                        value={"" + item.keyValue}
                        color="primary"
                      />

                      <div className={classes.indicadorEstado} style={{ backgroundColor: item.color }} />
                    </div>
                  }
                  label={item.nombre}
                />
              </div>
            );
          })}

          <Typography variant="body2" style={{ marginTop: "16px" }}>
            Protegidos
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                // name={"protegido"}
                checked={this.state.filtroProtegidos === true}
                onChange={this.handleCheckboxFiltroProtegidoChange}
                // value={this.state.filtroProtegidos}
                indeterminate={this.state.filtroProtegidos === undefined}
                color="primary"
              />
            }
            label={"Protegidos"}
          />
        </div>
      </div>
    );
  }

  renderToolbarLogo = () => {
    const { classes } = this.props;
    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
}

class CalendarioMes_Encabezado extends React.PureComponent {
  onBotonBackClick = () => {
    this.props.props.onNavigate("PREV");
    this.props.onBotonMesAnteriorClick && this.props.onBotonMesAnteriorClick();
  };

  onBotonNextClick = () => {
    this.props.props.onNavigate("NEXT");
    this.props.onBotonMesSiguienteClick && this.props.onBotonMesSiguienteClick();
  };

  render() {
    let { classes } = this.props;
    return (
      <div className={classNames(classes.calendarioEncabezado)}>
        <Typography className={classNames("titulo")} variant="headline">
          {this.props.props.label}
        </Typography>
        <IconButton onClick={this.onBotonBackClick} id="btn_MesAnterior">
          <IconKeyboardArrowLeftOutlined />
        </IconButton>
        <IconButton onClick={this.onBotonNextClick} id="btn_MesSiguiente">
          <IconKeyboardArrowRightOutlined />
        </IconButton>
      </div>
    );
  }
}

class CalendarioMes_Dia extends React.PureComponent {
  onClick = () => {
    if (this.props.deshabilitado == true) return;
    this.props.onClick && this.props.onClick(this.props.props.date);
  };

  render() {
    let fecha = this.props.props.date;
    let hoy = new Date();
    const esHoy = fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear();

    const seleccionado = this.props.seleccionado && this.props.seleccionado == true;
    // const conTurnos = this.props.conTurnos && this.props.conTurnos == true;
    // const deshabilitado = this.props.deshabilitado && this.props.deshabilitado == true;

    return (
      <div
        onClick={this.onClick}
        className={classNames(
          "customDate",
          esHoy && "hoy",
          seleccionado && "seleccionado"
          // conTurnos && "conTurnos"
          // deshabilitado && "deshabilitado"
        )}
        style={{ position: "relative" }}
      >
        <div className={this.props.classes.contenedorIndicadorDiaCalendario}>
          {(this.props.indicadores || []).map((item, index) => {
            return <div key={index} className={this.props.classes.indicadorDiaCalendario} style={{ backgroundColor: item }} />;
          })}
        </div>

        <label>{this.props.props.label}</label>
      </div>
    );
  }
}

let componente = ConsultaTurnos;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
