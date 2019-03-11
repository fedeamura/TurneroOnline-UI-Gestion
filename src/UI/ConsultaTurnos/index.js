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
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { IconButton, Typography, Grid, FormControlLabel, Checkbox, Tooltip, TextField } from "@material-ui/core";
import BigCalendar from "react-big-calendar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import orange from "@material-ui/core/colors/orange";

import IconKeyboardArrowLeftOutlined from "@material-ui/icons/KeyboardArrowLeftOutlined";
import IconKeyboardArrowRightOutlined from "@material-ui/icons/KeyboardArrowRightOutlined";
import IconLockOutlined from "@material-ui/icons/LockOutlined";
import IconLockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import IconSearchOutlined from "@material-ui/icons/SearchOutlined";
import IconClearOutlined from "@material-ui/icons/ClearOutlined";
import IconFilterListOutlined from "@material-ui/icons/FilterListOutlined";
import IconSaveAltOutlined from "@material-ui/icons/SaveAltOutlined";
import memoizeOne from "memoize-one";

//Mis Componentes
import _MiPagina from "../_MiPagina";
import MiBaner from "@Componentes/MiBaner";
import MiCard from "@Componentes/MiCard";
import MiTabla from "@Componentes/MiTabla";
import BotonesTabla from "./BotonesTabla";
import DialogoTurnoDetalle from "@UI/_Dialogos/TurnoDetalle";
import DialogoSelectorUsuario from "@UI/_Dialogos/SelectorUsuario";
import DialogoBusquedaPorCodigo from "@UI/_Dialogos/TurnoBusquedaPorCodigo";
import DialogoTurnoNuevo from "../_Dialogos/TurnoNuevo";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import DialogoUsuarioDetalle from "../_Dialogos/UsuarioDetalle";
import DateUtils from "@Componentes/Utils/Date";
import CordobaFilesUtils from "@Componentes/Utils/CordobaFiles";
import StringUtils from "@Componentes/Utils/String";

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

const ID_ROL_OPERADOR = 2156;
const ID_ROL_SUPERVISOR = 2157;
const ID_ROL_ADMINISTRADOR = 2158;

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
  },
  mostrarAlertaRoja: comando => {
    dispatch(mostrarAlertaRoja(comando));
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
      //Dialogo seleccionar usuario para busqueda
      dialogoSelectorUsuarioParaBusquedaVisible: false,
      usuarioBusqueda: undefined,
      //Menu Entidad
      anchorBotonMenuEntidad: undefined,
      filtroTextoTabla: ""
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

  buscarPorUsuario = usuario => {
    this.setState(
      { dialogoSelectorUsuarioParaBusquedaVisible: false, cargando: true, diaSeleccionado: undefined, filtroTextoTabla: "" },
      () => {
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
      }
    );
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
    filtroEstados = { ...filtroEstados };
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
    filtroEstados = {
      ...filtroEstados
    };

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
    this.setState(
      {
        usuarioBusqueda: undefined,
        filtroEstados: {
          ...this.state.filtroEstados,
          [ESTADO_VENCIDO_KEY_VALUE]: true,
          [ESTADO_DISPONIBLE_KEY_VALUE]: true,
          [ESTADO_CANCELADO_KEY_VALUE]: true,
          [ESTADO_RESERVADO_KEY_VALUE]: true,
          [ESTADO_COMPLETADO_KEY_VALUE]: true
        },
        filtroProtegidos: undefined,
        filtroTextoTabla: ""
      },
      () => {
        this.buscar();
      }
    );
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
    this.setState(
      {
        filtroProtegidos: undefined,
        usuarioBusqueda: undefined,
        filtroEstados: {
          ...this.state.filtroEstados,
          [ESTADO_VENCIDO_KEY_VALUE]: true,
          [ESTADO_DISPONIBLE_KEY_VALUE]: true,
          [ESTADO_CANCELADO_KEY_VALUE]: true,
          [ESTADO_RESERVADO_KEY_VALUE]: true,
          [ESTADO_COMPLETADO_KEY_VALUE]: true
        },
        mostrarFiltros: false,
        diaSeleccionado: undefined
      },
      () => {
        this.buscar();
      }
    );
  };

  onBotonCambiarTurneroClick = () => {
    this.setState({ anchorBotonMenuEntidad: undefined });
    this.props.redireccionar("/SeleccionarEntidad");
  };

  mostrarDialogoBuscarPorCodigo = () => {
    this.setState({ dialogoBuscarPorCodigoVisible: true });
  };

  onDialogoBuscarPorCodigoClose = () => {
    this.setState({ dialogoBuscarPorCodigoVisible: false });
  };

  onTurnoModificadoDesdeBusquedaPorCodigo = () => {
    if (this.state.usuarioBusqueda != undefined) {
      this.buscarPorUsuario(this.state.usuarioBusqueda);
    } else {
      this.buscar();
    }
  };

  onBotonMenuEntidadClick = e => {
    this.setState({ anchorBotonMenuEntidad: e.currentTarget });
  };

  onMenuEntidadClose = () => {
    this.setState({ anchorBotonMenuEntidad: undefined });
  };

  onBotonVerMasInformacionEntidadClick = () => {
    this.setState({ anchorBotonMenuEntidad: undefined });
    this.props.redireccionar("/Entidad/" + this.state.dataTurnero.entidadId);
  };

  mostrarDialogoTurnoNuevo = () => {
    this.setState({ dialogoTurnoNuevoVisible: true });
  };

  onDialogoTurnoNuevoClose = () => {
    this.setState({ dialogoTurnoNuevoVisible: false });
  };

  onTurnoCreado = turno => {
    if (this.state.usuarioBusqueda != undefined) {
      this.buscarPorUsuario(this.state.usuarioBusqueda);
    } else {
      this.buscar();
    }
    this.setState({ dialogoTurnoDetalleVisible: true, dialogoTurnoDetalleId: turno.id });
  };

  onToolbarTituloClick = () => {
    this.props.redireccionar("/SeleccionarEntidad");
  };

  getTurnos = memoizeOne((data, filtroEstados, filtroProtegidos, filtroTextoTabla, diaSeleccionado) => {
    let cantidadDeEstadosCheckeados = 0;
    for (let filtroEstado in filtroEstados) {
      if (filtroEstados[filtroEstado] === true) {
        cantidadDeEstadosCheckeados += 1;
      }
    }

    return _.filter(data, item => {
      let cumpleEstado = cantidadDeEstadosCheckeados === 0 || filtroEstados[item.estadoKeyValue] == true;
      let cumpleDia = diaSeleccionado == undefined || DateUtils.esMismoDia(diaSeleccionado, DateUtils.toDateTime(item.fecha));
      let cumpleProtegidos = filtroProtegidos == undefined || item.protegido == filtroProtegidos;

      let nombreUsuario = item.usuarioId == undefined ? "" : (item.usuarioNombre + " " + item.usuarioApellido);
      let cumpleTexto =
        filtroTextoTabla == "" ||
        item.codigo.toLowerCase().indexOf(filtroTextoTabla.toLowerCase()) != -1 ||
        (item.usuarioId != undefined && nombreUsuario.toLowerCase().indexOf(filtroTextoTabla.toLowerCase()) != -1);
      return cumpleEstado && cumpleDia && cumpleProtegidos && cumpleTexto;
      // return true;
    });
  });

  //Dialogo exportar
  onBotonExportarClick = () => {
    this.mostrarDialogoExportar();
  };

  mostrarDialogoExportar = () => {
    var fInicio = this.state.fechaCalendario;
    var fFin = new Date(this.state.fechaCalendario.getFullYear(), this.state.fechaCalendario.getMonth(), 1, 0, 0, 0, 0);
    var fFin = new Date(fInicio.getFullYear(), fInicio.getMonth() + 1, 1, 0, 0, 0, 0);
    let fechaInicio = DateUtils.toDateString(fInicio);
    let fechaFin = DateUtils.toDateString(fFin);

    let mensaje = `Se exportarán los turnos del periodo ${fechaInicio} a ${fechaFin}`;
    this.setState({ dialogoExportarVisible: true, dialogoExportarCargando: false, dialogoExportarMensaje: mensaje });
  };

  onDialogoExportarClose = () => {
    let cargando = this.state.dialogoExportarCargando;
    if (cargando == true) return;

    this.setState({ dialogoExportarVisible: false });
  };

  onDialogoExportarBotonSiClick = () => {
    var fInicio = this.state.fechaCalendario;
    var fFin = new Date(this.state.fechaCalendario.getFullYear(), this.state.fechaCalendario.getMonth(), 1, 0, 0, 0, 0);
    var fFin = new Date(fInicio.getFullYear(), fInicio.getMonth() + 1, 1, 0, 0, 0, 0);
    let fechaInicio = DateUtils.toDateString(fInicio);
    let fechaFin = DateUtils.toDateString(fFin);

    this.setState({ dialogoExportarCargando: true }, () => {
      Rules_Turnero.exportar({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        idTurnero: this.state.idTurnero
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Su archivo se empezará a descargar en breve" });

          let url = `${window.Config.URL_CORDOBA_FILES}/Archivo/${data}`;
          const link = document.createElement("a");
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ dialogoExportarVisible: false });
        });
    });
  };

  onUsuarioClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({
      dialogoUsuarioDetalleVisible: true,
      dialogoUsuarioDetalleId: id
    });
  };

  onDialogoUsuarioDetalleClose = e => {
    this.setState({ dialogoUsuarioDetalleVisible: false });
  };

  render() {
    const { classes, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <_MiPagina
          full
          cargando={this.state.cargando}
          toolbarChildren={this.renderToolbarChildren()}
          toolbarLeftIconVisible={false}
          onToolbarTituloClick={this.onToolbarTituloClick}
        >
          {/* Error */}
          <MiBaner
            mensaje={this.state.error}
            visible={this.state.mostrarError}
            className={classes.contenedorError}
            onClose={this.onBanerErrorClose}
          />

          <Grid container spacing={16}>
            <Grid item xs={12} md={4} lg={3} className={classNames(classes.contenedorCalendario, this.state.dataTurnero && "visible")}>
              {this.renderInfoContextual()}

              <Button
                variant="extendedFab"
                style={{ marginTop: 16, marginBottom: 32, backgroundColor: "white" }}
                onClick={this.mostrarDialogoTurnoNuevo}
              >
                <Icon style={{ marginRight: 8, color: "green" }}>add</Icon>
                Nuevo turno
              </Button>

              {this.renderCalendario()}
              {this.renderFiltrosActivos()}
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              {this.renderContenedorTabla()}
            </Grid>
          </Grid>

          {/* Dialogo detalle turno */}
          <DialogoTurnoDetalle
            idturno={this.state.dialogoTurnoDetalleId}
            visible={this.state.dialogoTurnoDetalleVisible}
            onClose={this.onDialogoTurnoDetalleClose}
          />

          {/* Dialogo selector usuario para busqueda */}
          <DialogoSelectorUsuario
            visible={this.state.dialogoSelectorUsuarioParaBusquedaVisible}
            onClose={this.onDialogoSelectorUsuarioParaBusquedaClose}
            onUsuarioSeleccionado={this.buscarPorUsuario}
          />

          {/* Turno nuevo */}
          <DialogoTurnoNuevo
            visible={this.state.dialogoTurnoNuevoVisible}
            onClose={this.onDialogoTurnoNuevoClose}
            idTurnero={this.state.dataTurnero && this.state.dataTurnero.id}
            fecha={this.state.diaSeleccionado || new Date()}
            callback={this.onTurnoCreado}
          />

          {/* Dialogo exportar */}
          <DialogoMensaje
            mensaje={this.state.dialogoExportarMensaje || ""}
            visible={this.state.dialogoExportarVisible || false}
            onClose={this.onDialogoExportarClose}
            cargando={this.state.dialogoExportarCargando || false}
            textoSi="Exportar"
            textoNo="Cancelar"
            autoCerrarBotonSi={false}
            onBotonSiClick={this.onDialogoExportarBotonSiClick}
          />

          {/* Dialogo uisuario detalle */}
          <DialogoUsuarioDetalle
            id={this.state.dialogoUsuarioDetalleId}
            visible={this.state.dialogoUsuarioDetalleVisible || false}
            onClose={this.onDialogoUsuarioDetalleClose}
          />
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderToolbarChildren() {
    return (
      <React.Fragment>
        <Tooltip title="Buscar por código" disableFocusListener={true}>
          <IconButton onClick={this.mostrarDialogoBuscarPorCodigo}>
            <Icon>search</Icon>
          </IconButton>
        </Tooltip>

        <DialogoBusquedaPorCodigo
          visible={this.state.dialogoBuscarPorCodigoVisible}
          onClose={this.onDialogoBuscarPorCodigoClose}
          onTurnoModificado={this.onTurnoModificadoDesdeBusquedaPorCodigo}
        />
      </React.Fragment>
    );
  }

  renderInfoContextual() {
    const { classes } = this.props;

    return (
      <div className={classNames(classes.contenedorInfoTurnero, this.state.dataTurnero && "visible")}>
        <MiCard className={classes.imagenTurnero} padding={false}>
          <div
            className="imagen"
            style={{
              width: 72,
              height: 72,
              backgroundImage: `url(${this.state.dataTurnero ? this.state.dataTurnero.entidadImagen : ""})`
            }}
          />
        </MiCard>
        <div className="textos">
          <Typography variant="body1">
            <b>Entidad: </b>
            {this.state.dataTurnero ? this.state.dataTurnero.entidadNombre : ""}
          </Typography>
          <Typography variant="body1">
            <b>Trámite: </b>
            {this.state.dataTurnero ? this.state.dataTurnero.tramiteNombre : ""}
          </Typography>
          <Typography variant="body1">
            <b>Turnero: </b>
            {this.state.dataTurnero ? this.state.dataTurnero.nombre : ""}
          </Typography>
        </div>
        <IconButton onClick={this.onBotonMenuEntidadClick}>
          <Icon>more_vert</Icon>
        </IconButton>

        <Menu
          id="menu_entidad"
          anchorEl={this.state.anchorBotonMenuEntidad}
          getContentAnchorEl={null}
          className={classes.menuEntidad}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(this.state.anchorBotonMenuEntidad)}
          onClose={this.onMenuEntidadClose}
        >
          {this.props.rol && (this.props.rol.rolId == ID_ROL_ADMINISTRADOR || this.props.rol.rolId == ID_ROL_SUPERVISOR) && (
            <MenuItem divider onClick={this.onBotonVerMasInformacionEntidadClick}>
              Gestionar
            </MenuItem>
          )}
          <MenuItem onClick={this.onBotonCambiarTurneroClick}>Cambiar turnero</MenuItem>
        </Menu>
      </div>
    );
  }

  onView = () => {};

  renderCalendario() {
    const { classes } = this.props;
    const { usuarioBusqueda } = this.state;

    return (
      <MiCard padding={false} className={classNames(classes.cardCalendario, usuarioBusqueda === undefined && "visible")}>
        <MiCalendario
          estados={this.state.estados}
          data={this.state.data}
          diaSeleccionado={this.state.diaSeleccionado}
          fechaCalendario={this.state.fechaCalendario}
          classes={classes}
          usuarioBusqueda={usuarioBusqueda}
          onDiaClick={this.onDiaClick}
          onBotonMesAnteriorClick={this.onBotonMesAnteriorClick}
          onBotonMesSiguienteClick={this.onBotonMesSiguienteClick}
        />
      </MiCard>
    );
  }

  renderFiltrosActivos() {
    let { classes } = this.props;

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
    );
  }

  onFiltroTextoChange = e => {
    this.setState({ filtroTextoTabla: e.currentTarget.value });
  };

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
              <Typography variant="title" className="titulo">
                {titulo}
              </Typography>

              <div className={"filtros"}>
                <div className={classNames(classes.collapseView, this.state.buscarEnTablaVisible == true && "visible")}>
                  <TextField
                    id="inputBusqueda"
                    variant="outlined"
                    placeholder="QAZWSX/2018"
                    className={classes.inputBusquedaTabla}
                    value={this.state.filtroTextoTabla}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon>search</Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              this.setState({ buscarEnTablaVisible: false, filtroTextoTabla: "" });
                            }}
                          >
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    onChange={this.onFiltroTextoChange}
                  />
                </div>

                <div className={classNames(classes.collapseView, this.state.buscarEnTablaVisible != true && "visible")}>
                  <Tooltip title="Buscar en tabla" disableFocusListener={true}>
                    <IconButton
                      onClick={() => {
                        this.setState({ buscarEnTablaVisible: true });
                      }}
                    >
                      <IconSearchOutlined />
                    </IconButton>
                  </Tooltip>
                </div>

                <Tooltip title="Exportar tabla" disableFocusListener={true}>
                  <IconButton onClick={this.onBotonExportarClick}>
                    <IconSaveAltOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filtros" disableFocusListener={true}>
                  <IconButton onClick={this.onBotonFiltrosClick}>
                    <IconFilterListOutlined />
                  </IconButton>
                </Tooltip>
              </div>
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
    let { data, filtroEstados, filtroProtegidos, filtroTextoTabla, diaSeleccionado } = this.state;
    data = data || [];

    var turnos = this.getTurnos(data, filtroEstados, filtroProtegidos, filtroTextoTabla, diaSeleccionado);
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
          { id: "usuario", label: "Usuario", orderBy: this.columnaUsuarioOrderBy },
          { id: "botones", label: "" },
          { id: "data", hidden: true }
        ]}
        rows={turnos.map(item => {
          return {
            codigo: this.columnaCodigoRender(item),
            fecha: this.columnaFechaRender(item),
            estadoNombre: this.columnaEstadoRender(item),
            usuario: this.columnaUsuarioRender(item),
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
          <Tooltip title={"Turno protegido"} disableFocusListener={true}>
            <IconLockOutlined style={{ color: orange["600"] }} />
          </Tooltip>
        ) : (
          <Tooltip title={"Turno no protegido"} disableFocusListener={true}>
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

  columnaUsuarioRender(data) {
    const { classes } = this.props;

    if (data.usuarioId == undefined) return null;

    var urlImagen = CordobaFilesUtils.getUrlFotoMiniatura(data.usuarioIdentificadorFotoPersonal, data.usuarioSexoMasculino);

    var nombre = StringUtils.toTitleCase(data.usuarioNombre + " " + data.usuarioApellido);
    return (
      <div className={classes.colUsuario}>
        <div className="imagen" style={{ backgroundImage: `url(${urlImagen})` }} />
        <Typography data-id={data.usuarioId} className="nombre" variant="body1" onClick={this.onUsuarioClick}>
          {nombre}
        </Typography>
      </div>
    );
  }

  columnaUsuarioOrderBy(dataA, dataB) {
    let valorA;
    if (dataA.data.usuarioId == undefined) {
      valorA = "";
    } else {
      valorA = dataA.data.usuarioNombre + " " + dataA.data.usuarioApellido;
    }

    let valorB;
    if (dataB.data.usuarioId == undefined) {
      valorB = "";
    } else {
      valorB = dataB.data.usuarioNombre + " " + dataB.data.usuarioApellido;
    }

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
        <div className={classes.contenedorTituloFiltros}>
          <Typography variant="title" className="titulo">
            Filtros
          </Typography>
          <IconButton onClick={this.onBotonFiltrosClick}>
            <IconClearOutlined />
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

          {!this.state.usuarioBusqueda && (
            <Button variant="outlined" color="primary" onClick={this.mostrarDialogoSelectorUsuarioParaBusqueda}>
              Filtrar por usuario
            </Button>
          )}

          {this.state.usuarioBusqueda && (
            <Button variant="outlined" color="primary" onClick={this.cancelarBusquedaPorUsuario}>
              Quitar filtro por usuario
            </Button>
          )}
        </div>
      </div>
    );
  }
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

class MiCalendario extends React.PureComponent {
  render() {
    const { estados, fechaCalendario, classes, diaSeleccionado, data, usuarioBusqueda } = this.props;

    return (
      <BigCalendar
        view="month"
        onView={this.onView}
        onNavigate={this.onView}
        date={fechaCalendario}
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
                  onBotonMesAnteriorClick={this.props.onBotonMesAnteriorClick}
                  onBotonMesSiguienteClick={this.props.onBotonMesSiguienteClick}
                />
              );
            },
            dateHeader: props => {
              let diaCalendario = props.date;
              let seleccionado = diaSeleccionado && DateUtils.esMismoDia(diaSeleccionado, diaCalendario);

              let indicadores = [];

              if (usuarioBusqueda) {
                seleccionado = false;
                indicadores = [];
              } else {
                _.forEach(estados, estado => {
                  let conTurnosEnEstado = _.find(data, item => {
                    let fechaTurno = DateUtils.toDateTime(item.fecha);
                    let mismoDia = DateUtils.esMismoDia(fechaTurno, diaCalendario);
                    return item.estadoKeyValue == estado.keyValue && mismoDia == true;
                  });
                  if (conTurnosEnEstado) indicadores.push(conTurnosEnEstado.estadoColor);
                });
              }

              return (
                <CalendarioMes_Dia
                  deshabilitado={false}
                  conTurnos={false}
                  classes={classes}
                  seleccionado={seleccionado}
                  indicadores={indicadores}
                  onClick={this.props.onDiaClick}
                  props={props}
                />
              );
            }
          }
        }}
      />
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
