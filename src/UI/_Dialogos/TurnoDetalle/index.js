import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { mostrarAlertaVerde, mostrarAlertaNaranja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import { Typography, Button, CircularProgress } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import IconAssignmentLateOutlined from "@material-ui/icons/AssignmentLateOutlined";
import IconAssignmentIndOutlined from "@material-ui/icons/AssignmentIndOutlined";
import IconCancelOutlined from "@material-ui/icons/CancelOutlined";
import IconCheckCircleOutlined from "@material-ui/icons/CheckCircleOutlined";
import IconSwapVertOutlined from "@material-ui/icons/SwapVertOutlined";
import IconSwapVerticalCircle from "@material-ui/icons/SwapVerticalCircleOutlined";
import IconLockOutlined from "@material-ui/icons/LockOutlined";
import IconLockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import orange from "@material-ui/core/colors/orange";

//Mis Componentes
import UsuarioDetalle from "@Componentes/MiUsuarioDetalle";
import DialogoInput from "@UI/_Dialogos/Input";
import DialogoConfirmacion from "@UI/_Dialogos/Confirmacion";
import DialogoSelectorUsuario from "@UI/_Dialogos/SelectorUsuario";
import MiBaner from "@Componentes/MiBaner";
import DialogoTurnoHistorialEstado from "@UI/_Dialogos/TurnoHistorialEstado";
import DateUtils from '@Componentes/Utils/Date';

//Rules
import Rules_Turno from "@Rules/Rules_Turno";

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

class DialogoTurnoDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      mostrarError: false,
      turnoModificado: false,
      //Cancelar reserva
      dialogoCancelarReservaVisible: false,
      //Dialogo selector usuario
      dialogoSelectorUsuarioVisible: false,
      //Dialogo cancelar turno
      dialogoCancelarTurnoVisible: false,
      //Dialogo completar turno
      dialogoConfirmacionCompletarTurnoVisible: false,
      //Dialogo confirmacion poner estado reservado
      dialogoConfirmacionPonerEnEstadoReservadoVisible: false,
      //Dialogo confirmacion poner estado disponible
      dialogoConfirmacionPonerEnEstadoDisponibleVisible: false,
      //Dialogo historial estado
      dialogoHistorialEstadoVisible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible == true) {
        this.setState({ data: undefined, turnoModificado: false });
        this.buscar(nextProps.idturno);
      }
    }
  }

  buscar = id => {
    this.setState({ cargando: true }, () => {
      Rules_Turno.getDetalle({ id: id, idEntidad: this.props.rol.entidadId })
        .then(data => {
          console.log(data);
          this.setState({ data: data });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onClose = () => {
    if (this.state.cargando == true) return;
    this.props.onClose && this.props.onClose(this.state.turnoModificado);
  };

  cancelarReservaTurno = motivo => {
    if (motivo.trim().length == 0) {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el motivo de cancelación de la reserva" });
      return;
    }
    this.onDialogoCancelarReservaTurnoClose();

    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.cancelarReserva({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id,
        motivo: motivo.trim()
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Reserva del turno cancelada correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  asignarUsuario = usuario => {
    this.onDialogoSelectorUsuarioClose();

    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.asignar({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id,
        idUsuario: usuario.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turno asigando correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  cancelarTurno = motivo => {
    if (motivo.trim().length == 0) {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el motivo de cancelación" });
      return;
    }
    this.onDialogoCancelarTurnoClose();
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.cancelar({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id,
        motivo: motivo.trim()
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turno cancelado correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  completarTurno = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.completar({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turno completado correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };
  ponerEnEstadoReservado = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.ponerEnEstadoReservado({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Estado modificado correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  ponerEnEstadoDisponible = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.ponerEnEstadoDisponible({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Estado modificado correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  proteger = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.proteger({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turno protegido correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  desproteger = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.desproteger({
        idEntidad: this.props.rol.entidadId,
        idTurno: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turno desprotegido correctamente" });
          this.setState({ turnoModificado: true });
          this.buscar(this.state.data.id);
        })
        .catch(error => {
          this.setState({ cargando: false, mostrarError: true, error: error });
        });
    });
  };

  mostrarDialogoCancelarReservaTurno = () => {
    this.setState({ dialogoCancelarReservaVisible: true });
  };

  onDialogoCancelarReservaTurnoClose = () => {
    this.setState({ dialogoCancelarReservaVisible: false });
  };

  mostrarDialogoSelectorUsuario = () => {
    this.setState({ dialogoSelectorUsuarioVisible: true });
  };

  onDialogoSelectorUsuarioClose = () => {
    this.setState({ dialogoSelectorUsuarioVisible: false });
  };

  mostrarDialogoCancelarTurno = () => {
    this.setState({ dialogoCancelarTurnoVisible: true });
  };

  onDialogoCancelarTurnoClose = () => {
    this.setState({ dialogoCancelarTurnoVisible: false });
  };

  mostrarDialogoConfirmacionCompletarTurno = () => {
    this.setState({ dialogoConfirmacionCompletarTurnoVisible: true });
  };

  onDialogoConfirmacionCompletarTurnoClose = () => {
    this.setState({ dialogoConfirmacionCompletarTurnoVisible: false });
  };

  mostrarDialogoConfirmacionPonerEnEstadoDisponible = () => {
    this.setState({ dialogoConfirmacionPonerEnEstadoDisponibleVisible: true });
  };

  onDialogoConfirmacionPonerEnEstadoDisponibleClose = () => {
    this.setState({ dialogoConfirmacionPonerEnEstadoDisponibleVisible: false });
  };

  mostrarDialogoConfirmacionPonerEnEstadoReservado = () => {
    this.setState({ dialogoConfirmacionPonerEnEstadoReservadoVisible: true });
  };

  onDialogoConfirmacionPonerEnEstadoReservadoClose = () => {
    this.setState({ dialogoConfirmacionPonerEnEstadoReservadoVisible: false });
  };

  onBaneErrorClose = () => {
    this.setState({ mostrarError: false });
  };

  mostrarDialogoHistorialEstado = () => {
    this.setState({ dialogoHistorialEstadoVisible: true });
  };

  onDialogoHistorialEstadoClose = () => {
    this.setState({ dialogoHistorialEstadoVisible: false });
  };

  render() {
    const { classes, usuario, fullScreen } = this.props;
    if (usuario == undefined) return null;

    let codigo = "";
    let estadoColor = "";
    let estadoNombre = "";
    let entidadNombre = "";
    let tramiteNombre = "";
    let turneroNombre = "";
    let estadoKeyValue = "";
    let fecha = "";
    let horaInicio = "";
    let horaFin = "";
    let dataUsuarioAsociado = undefined;

    if (this.state.data) {
      codigo = this.state.data.codigo + "/" + this.state.data.año;
      estadoColor = this.state.data.estadoColor;
      estadoNombre = this.state.data.estadoNombre;
      entidadNombre = this.state.data.entidadNombre;
      estadoKeyValue = this.state.data.estadoKeyValue;
      tramiteNombre = this.state.data.tramiteNombre;
      turneroNombre = this.state.data.turneroNombre;
      fecha = DateUtils.toDateString(DateUtils.toDate(this.state.data.fecha));
      horaInicio = DateUtils.transformarDuracion(this.state.data.inicio, 5);
      horaFin = DateUtils.transformarDuracion(this.state.data.inicio + this.state.data.duracion, 5);

      if (this.state.data.usuarioAsociado) {
        dataUsuarioAsociado = this.state.data.usuarioAsociado;
      }
    }

    return (
      <React.Fragment>
        <Dialog fullScreen={fullScreen} open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <MiBaner
            visible={this.state.mostrarError}
            mensaje={this.state.error}
            onClose={this.onBaneErrorClose}
            className={classes.contenedorError}
          />
          <DialogContent style={{ padding: 0 }}>
            <div>
              <div className={classes.contenedorEncabezado}>
                <div className={classes.primeraLineaEncabezado}>
                  <div className={classes.contenedorCodigo}>
                    <Typography variant="headline">{codigo}</Typography>
                    <Typography variant="body1">
                      {fecha} de {horaInicio}
                      hs a {horaFin}
                      hs
                    </Typography>
                  </div>

                  <div className={classes.contenedorEstado}>
                    <div className={classes.indicadorEstado} style={{ backgroundColor: estadoColor }} />
                    <Typography variant="body1">{estadoNombre}</Typography>
                  </div>
                </div>

                <div className={classes.conenedorTexto}>
                  <Typography variant="body2">Entidad:</Typography>
                  <Typography variant="body1">{entidadNombre}</Typography>
                </div>
                <div className={classes.conenedorTexto}>
                  <Typography variant="body2">Tramite:</Typography>
                  <Typography variant="body1">{tramiteNombre}</Typography>
                </div>
                <div className={classes.conenedorTexto}>
                  <Typography variant="body2">Turnero:</Typography>
                  <Typography variant="body1">{turneroNombre}</Typography>
                </div>
                <div className={classes.contenedorBotones}>
                  {/* Ver historial de estados */}
                  <Button variant="outlined" onClick={this.mostrarDialogoHistorialEstado}>
                    <IconSwapVertOutlined />
                    Ver historial de estados
                  </Button>

                  {/* Cambiar a disponible */}
                  {[ESTADO_CANCELADO_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoConfirmacionPonerEnEstadoDisponible}>
                      <IconSwapVerticalCircle />
                      Poner en estado Disponible
                    </Button>
                  )}

                  {/* Cambiar a Reservado */}
                  {[ESTADO_COMPLETADO_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoConfirmacionPonerEnEstadoReservado}>
                      <IconSwapVerticalCircle />
                      Poner en estado Reservado
                    </Button>
                  )}

                  {/* Asignar turno */}
                  {[ESTADO_DISPONIBLE_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoSelectorUsuario}>
                      <IconAssignmentIndOutlined />
                      Asignar turno
                    </Button>
                  )}

                  {/* cancelar reserva */}
                  {[ESTADO_RESERVADO_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoCancelarReservaTurno}>
                      <IconAssignmentLateOutlined />
                      Cancelar reserva
                    </Button>
                  )}

                  {/* Cancelar turno */}
                  {[ESTADO_RESERVADO_KEY_VALUE, ESTADO_DISPONIBLE_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoCancelarTurno}>
                      <IconCancelOutlined />
                      Cancelar turno
                    </Button>
                  )}

                  {/* Completar turno */}
                  {[ESTADO_RESERVADO_KEY_VALUE].indexOf(estadoKeyValue) != -1 && (
                    <Button variant="outlined" onClick={this.mostrarDialogoConfirmacionCompletarTurno}>
                      <IconCheckCircleOutlined />
                      Completar turno
                    </Button>
                  )}

                  {/* Proteger turno */}
                  {[ESTADO_DISPONIBLE_KEY_VALUE].indexOf(estadoKeyValue) != -1 &&
                    this.state.data &&
                    this.state.data.protegido == false && (
                      <Button variant="outlined" onClick={this.proteger}>
                        <IconLockOutlined />
                        Proteger
                      </Button>
                    )}

                  {/* Desproteger turno */}
                  {[ESTADO_DISPONIBLE_KEY_VALUE].indexOf(estadoKeyValue) != -1 &&
                    this.state.data &&
                    this.state.data.protegido == true && (
                      <Button variant="outlined" onClick={this.desproteger}>
                        <IconLockOpenOutlined />
                        Desproteger
                      </Button>
                    )}
                </div>
              </div>

              {/* Alerta protegido */}
              {this.state.data &&
                this.state.data.protegido == true && (
                  <div style={{ backgroundColor: orange["600"], padding: "8px", paddingLeft: "24px", paddingRight: "24px" }}>
                    <Typography variant="body1" style={{ color: "white" }}>
                      Su turno se encuentra protegido
                    </Typography>
                  </div>
                )}

              <div className={classes.contenedorBody}>
                {dataUsuarioAsociado && (
                  <React.Fragment>
                    <Typography variant="headline">Usuario asociado</Typography>
                    <UsuarioDetalle data={dataUsuarioAsociado} />
                  </React.Fragment>
                )}

                {this.state.data &&
                  this.state.data.personalAsociado &&
                  this.state.data.personalAsociado.length != 0 && (
                    <React.Fragment>
                      {dataUsuarioAsociado && <div style={{ height: "16px" }} />}
                      <Typography variant="headline">Personal asociado</Typography>
                      {this.state.data.personalAsociado.map((item, index) => {
                        return <UsuarioDetalle key={index} data={item} />;
                      })}
                    </React.Fragment>
                  )}
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            {/* <Button onClick={this.onClose} color="primary">
              Disagree
            </Button> */}
            <Button color="primary" onClick={this.onClose} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
          <div className={classNames(classes.contenedorIndicadorCargando, this.state.cargando && "visible")}>
            <CircularProgress />
          </div>
        </Dialog>

        {/* Dialogo cancelar reserva turno */}
        <DialogoInput
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
        />

        {/* Dialogo selector usuario */}
        <DialogoSelectorUsuario
          visible={this.state.dialogoSelectorUsuarioVisible}
          onClose={this.onDialogoSelectorUsuarioClose}
          onUsuarioSeleccionado={this.asignarUsuario}
        />

        {/* Dialogo cancelar turno */}
        <DialogoInput
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
        />

        {/* Dialogo confirmacion completar turno */}
        <DialogoConfirmacion
          visible={this.state.dialogoConfirmacionCompletarTurnoVisible}
          mensaje="¿Desea completar el turno?"
          onClose={this.onDialogoConfirmacionCompletarTurnoClose}
          onBotonSiClick={this.completarTurno}
        />

        {/* Dialogo confirmacion poner en estado reservado */}
        <DialogoConfirmacion
          visible={this.state.dialogoConfirmacionPonerEnEstadoReservadoVisible}
          mensaje="¿Desea cambiar el estado del turno a 'Reservado'?"
          onClose={this.onDialogoConfirmacionPonerEnEstadoReservadoClose}
          onBotonSiClick={this.ponerEnEstadoReservado}
        />

        {/* Dialogo confirmacion poner en estado disponible */}
        <DialogoConfirmacion
          visible={this.state.dialogoConfirmacionPonerEnEstadoDisponibleVisible}
          mensaje="¿Desea cambiar el estado del turno a 'Disponible'?"
          onClose={this.onDialogoConfirmacionPonerEnEstadoDisponibleClose}
          onBotonSiClick={this.ponerEnEstadoDisponible}
        />

        {/* Dialogo hjistorial estado */}
        <DialogoTurnoHistorialEstado
          idturno={this.state.data && this.state.data.id}
          visible={this.state.dialogoHistorialEstadoVisible}
          onClose={this.onDialogoHistorialEstadoClose}
        />
      </React.Fragment>
    );
  }
}

let componente = DialogoTurnoDetalle;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;