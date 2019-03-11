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
import { Typography, Button, CircularProgress, Grid, DialogTitle, Icon, IconButton } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { InlineDatePicker, InlineTimePicker } from "material-ui-pickers";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

//Mis Componentes
import MiBaner from "@Componentes/MiBaner";
import DateUtils from "@Componentes/Utils/Date";
import DialogoTurnoDetalle from "../TurnoDetalle";

//Rules
import Rules_Turno from "@Rules/Rules_Turno";

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

class DialogoTurnoNuevo extends React.Component {
  constructor(props) {
    super(props);

    let hora = new Date();
    hora.setHours(8);
    hora.setMinutes(0);
    hora.setSeconds(0);
    hora.setMilliseconds(0);

    let horaFin = new Date();
    horaFin.setHours(9);
    horaFin.setMinutes(0);
    horaFin.setSeconds(0);
    horaFin.setMilliseconds(0);

    this.state = {
      idTurnero: props.idTurnero,
      cargando: false,
      errorVisible: false,
      error: undefined,
      fecha: props.fecha || new Date(),
      hora: hora,
      horaFin: horaFin,
      protegido: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible == true) {
        let hora = new Date();
        hora.setHours(8);
        hora.setMinutes(0);
        hora.setSeconds(0);
        hora.setMilliseconds(0);

        let horaFin = new Date();
        horaFin.setHours(9);
        horaFin.setMinutes(0);
        horaFin.setSeconds(0);
        horaFin.setMilliseconds(0);

        this.setState({
          idTurnero: nextProps.idTurnero,
          errorVisible: false,
          cargando: false,
          fecha: nextProps.fecha || new Date(),
          protegido: false,
          hora: hora,
          horaFin: horaFin,
          turnosColision: undefined,
          turnosColisionDetalleVisible: false
        });
      }
    }
  }

  onClose = () => {
    if (this.state.cargando == true) return;
    this.props.onClose && this.props.onClose();
  };

  onBaneErrorClose = () => {
    this.setState({ errorVisible: false });
  };

  onFecha = fechaNueva => {
    this.setState({ fecha: fechaNueva });
  };

  onHora = hora => {
    let min = hora.getMinutes();
    if (min % 5 != 0) {
      min = min - (min % 5);
      hora.setMinutes(min);
    }
    this.setState({ hora: hora });
  };

  onHoraFin = hora => {
    let min = hora.getMinutes();
    if (min % 5 != 0) {
      min = min - (min % 5);
      hora.setMinutes(min);
    }
    this.setState({ horaFin: hora });
  };

  onProtegido = event => {
    this.setState({
      protegido: event.target.checked
    });
  };

  getMinutesBetweenDates = (startDate, endDate) => {
    var diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
  };

  guardarTurno = () => {
    let fechaState = this.state.fecha;
    let horaState = this.state.hora;
    let horaFinState = this.state.horaFin;

    let duracion = this.getMinutesBetweenDates(horaState, horaFinState);
    if (duracion == 0) {
      this.setState({ errorVisible: true, error: "Duracion del turno inválida" });
      return;
    }

    if (horaFinState.getHours() == 0 && horaFinState.getMinutes() == 0 && duracion < 0) {
      let horaFinCorregida = new Date(horaState.getFullYear(), horaState.getMonth(), horaState.getDate(), 24, 0);
      duracion = this.getMinutesBetweenDates(horaState, horaFinCorregida);
    }

    if (duracion <= 0) {
      this.setState({ errorVisible: true, error: "La hora de fin debe ser mayor a la de inicio" });
      return;
    }

    if (horaState.getMinutes() % 5 != 0) {
      this.setState({ errorVisible: true, error: "Hora de inicio inválida" });
      return;
    }

    if (horaFinState.getMinutes() % 5 != 0) {
      this.setState({ errorVisible: true, error: "Hora de fin inválida" });
      return;
    }

    let dia = fechaState.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = parseInt(fechaState.getMonth()) + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fechaState.getFullYear();
    let hora = horaState.getHours();
    if (hora < 10) hora = "0" + hora;
    let min = horaState.getMinutes();
    if (min < 10) min = "0" + min;
    let fecha = `${dia}/${mes}/${año} ${hora}:${min}:00`;

    this.setState(
      {
        cargando: true,
        errorVisible: false,
        turnosColision: undefined,
        turnosColisionDetalleVisible: false
      },
      () => {
        Rules_Turno.getColisionesNuevoTurno({
          idTurnero: this.state.idTurnero,
          fecha: fecha,
          duracion: duracion,
          protegido: this.state.protegido
        })
          .then(data => {
            if (data.length > 0) {
              this.setState({ cargando: false, turnosColision: data });
            } else {
              this.guardarTurnoDeTodosModos();
            }
          })
          .catch(error => {
            this.setState({ cargando: false, errorVisible: true, error: error });
          });
      }
    );
  };

  guardarTurnoDeTodosModos = () => {
    let fechaState = this.state.fecha;
    let horaState = this.state.hora;
    let horaFinState = this.state.horaFin;

    let duracion = this.getMinutesBetweenDates(horaState, horaFinState);
    if (duracion == 0) {
      this.setState({
        errorVisible: true,
        error: "Duracion del turno inválida",
        turnosColision: undefined,
        turnosColisionDetalleVisible: false
      });
      return;
    }

    if (horaFinState.getHours() == 0 && horaFinState.getMinutes() == 0 && duracion < 0) {
      let horaFinCorregida = new Date(horaState.getFullYear(), horaState.getMonth(), horaState.getDate(), 24, 0);
      duracion = this.getMinutesBetweenDates(horaState, horaFinCorregida);
    }

    if (duracion <= 0) {
      this.setState({ errorVisible: true, error: "La hora de fin debe ser mayor a la de inicio" });
      return;
    }

    if (horaState.getMinutes() % 5 != 0) {
      this.setState({ errorVisible: true, error: "Hora de inicio inválida" });
      return;
    }

    if (horaFinState.getMinutes() % 5 != 0) {
      this.setState({ errorVisible: true, error: "Hora de fin inválida" });
      return;
    }

    let dia = fechaState.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = parseInt(fechaState.getMonth()) + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fechaState.getFullYear();
    let hora = horaState.getHours();
    if (hora < 10) hora = "0" + hora;
    let min = horaState.getMinutes();
    if (min < 10) min = "0" + min;
    let fecha = `${dia}/${mes}/${año} ${hora}:${min}:00`;

    this.setState(
      {
        cargando: true,
        errorVisible: false,
        turnosColision: undefined,
        turnosColisionDetalleVisible: false
      },
      () => {
        Rules_Turno.insertar({
          idTurnero: this.state.idTurnero,
          fecha: fecha,
          duracion: duracion,
          protegido: this.state.protegido
        })
          .then(turno => {
            this.setState({ cargando: false }, () => {
              this.onClose();
              this.props.mostrarAlertaVerde({ texto: "Turno registrado correctamente" });
              this.props.callback && this.props.callback(turno);
            });
          })
          .catch(error => {
            this.setState({ cargando: false, errorVisible: true, error: error });
          });
      }
    );
  };

  onBotonTurnosColisionClick = () => {
    this.setState({ turnosColisionDetalleVisible: !(this.state.turnosColisionDetalleVisible || false) });
  };

  onBotonTurnoColisionDetalleClick = e => {
    let id = e.currentTarget.attributes.idturno.value;
    this.setState({ dialogoTurnoDetalleVisible: true, idTurnoDetalle: id });
  };

  onDialogoTurnoDetalleClose = () => {
    this.setState({ dialogoTurnoDetalleVisible: false });
  };

  render() {
    const { classes, fullScreen } = this.props;
    const { cargando, fecha, hora, horaFin } = this.state;

    return (
      <React.Fragment>
        <Dialog fullScreen={fullScreen} open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <MiBaner
            visible={this.state.errorVisible}
            mensaje={this.state.error}
            modo="error"
            botonVisible={true}
            onBotonClick={this.onBaneErrorClose}
            className={classes.contenedorError}
          />

          <DialogTitle>Nuevo turno</DialogTitle>
          <DialogContent style={{ paddingLeft: 0, paddingRight: 0 }}>
            <MiBaner
              visible={this.state.turnosColision && this.state.turnosColision.length != 0}
              botonIcono={<Icon>{this.state.turnosColisionDetalleVisible ? "keyboard_arrow_up" : "keyboard_arrow_down"}</Icon>}
              botonVisible={true}
              onBotonClick={this.onBotonTurnosColisionClick}
              mensaje={
                this.state.turnosColision &&
                `El turno por ingresar colisiona con ${this.state.turnosColision.length} ${
                  this.state.turnosColision.length == 1 ? "turno" : "turnos"
                }`
              }
            />

            {this.state.turnosColision && this.state.turnosColisionDetalleVisible == true && (
              <div style={{ backgroundColor: "rgba(0,0,0,0.025)" }}>
                <Typography variant="body2" style={{ marginLeft: 20, paddingTop: 16 }}>
                  Turnos en colisión
                </Typography>
                <List>
                  {this.state.turnosColision.map((turno, index) => {
                    return (
                      <ListItem button key={index} idturno={turno.id} onClick={this.onBotonTurnoColisionDetalleClick}>
                        <ListItemText primary={turno.codigo} secondary={DateUtils.toDateTimeString(DateUtils.toDateTime(turno.fecha))} />
                        <ListItemSecondaryAction style={{ marginRight: 16 }}>
                          <IconButton idturno={turno.id} onClick={this.onBotonTurnoColisionDetalleClick}>
                            <Icon>assignment</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}

            <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16 }}>
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <InlineDatePicker
                    fullWidth
                    label="Fecha"
                    keyboard
                    variant="outlined"
                    format="dd/MM/yyyy"
                    placeholder="10/10/2018"
                    mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                    disableOpenOnEnter
                    animateYearScrolling={false}
                    value={fecha || null}
                    maxDateMessage="Fecha inválida"
                    minDateMessage="Fecha inválida"
                    invalidDateMessage="Fecha inválida"
                    onChange={this.onFecha}
                  />
                </Grid>

                <Grid item xs={6} />

                <Grid item xs={6}>
                  <InlineTimePicker
                    fullWidth
                    keyboard
                    label="Hora Inicio"
                    format="HH:mm"
                    value={hora}
                    ampm={false}
                    variant="outlined"
                    onChange={this.onHora}
                    mask={value => (value ? [/\d/, /\d/, ":", /\d/, /\d/] : [])}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InlineTimePicker
                    fullWidth
                    keyboard
                    label="Hora Fin"
                    format="HH:mm"
                    variant="outlined"
                    value={horaFin}
                    ampm={false}
                    onChange={this.onHoraFin}
                    mask={value => (value ? [/\d/, /\d/, ":", /\d/, /\d/] : [])}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.protegido} onChange={this.onProtegido} value="Protegido" />}
                    label="Protegido"
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.onClose}>Cancelar</Button>

            {this.state.turnosColision == undefined && (
              <Button color="primary" onClick={this.guardarTurno}>
                Aceptar
              </Button>
            )}
            {this.state.turnosColision && (
              <Button color="primary" variant="raised" onClick={this.guardarTurnoDeTodosModos}>
                Registrar de todos modos
              </Button>
            )}
          </DialogActions>
          <div className={classNames(classes.contenedorIndicadorCargando, cargando && "visible")}>
            <CircularProgress />
          </div>
        </Dialog>

        <DialogoTurnoDetalle
          idturno={this.state.idTurnoDetalle || 0}
          onClose={this.onDialogoTurnoDetalleClose}
          visible={this.state.dialogoTurnoDetalleVisible || false}
        />
      </React.Fragment>
    );
  }
}

let componente = DialogoTurnoNuevo;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
