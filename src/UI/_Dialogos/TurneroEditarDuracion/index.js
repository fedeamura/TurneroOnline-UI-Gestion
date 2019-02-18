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
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import InputAdornment from "@material-ui/core/InputAdornment";

//Mis Componentes
import DialogoForm from "@Componentes/MiDialogoForm";
import StringUtils from "@Componentes/Utils/String";
import DateUtils from "@Componentes/Utils/Date";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";

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

class DialogoTurneroEditarDuracion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      cargando: false,
      errorVisible: false,
      errorMensaje: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible == true) {
      this.setState({ errorVisible: false, cargando: false, data: undefined });
      this.buscarDatos();
    }
  }

  buscarDatos = () => {
    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Turnero.getDetalle(this.props.id)
        .then(data => {
          if (data == null) {
            this.setState({
              errorVisible: true,
              errorMensaje: "El turnero no existe"
            });
          } else {
            this.callback &&
              this.callback.setValores([
                {
                  key: "nombre",
                  value: data.nombre
                },
                {
                  key: "descripcion",
                  value: data.descripcion || ""
                },
                {
                  key: "fechaInicio",
                  value: DateUtils.toDate(data.fechaInicio)
                },
                {
                  key: "fechaFin",
                  value: DateUtils.toDate(data.fechaFin)
                },
                {
                  key: "duracionTurno",
                  value: data.duracionTurno
                }
              ]);

            this.setState({ data: data });
          }
        })
        .catch(error => {
          this.setState({ errorVisible: true, errorMensaje: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onClose = (e, turnero) => {
    if (this.state.cargando == true) return;
    this.props.onClose && this.props.onClose(turnero);
  };

  onBanerBotonClick = () => {
    this.setState({ errorVisible: false });
  };

  guardar = data => {
    let { fechaInicio, fechaFin, duracionTurno } = data;

    if (fechaInicio == undefined) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese la fecha de inicio"
      });
      return;
    }

    if (fechaFin == undefined) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese la fecha de fin"
      });
      return;
    }

    if (fechaInicio >= fechaFin) {
      this.setState({
        errorVisible: true,
        errorMensaje: "La fecha de inicio debe ser menor a la fecha de fin"
      });
      return;
    }

    if (duracionTurno == "") {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese la duración del turno"
      });
      return;
    }

    let duracionValida = duracionTurno > 0 && duracionTurno % 5 == 0;

    if (!duracionValida) {
      this.setState({
        errorVisible: true,
        errorMensaje: "La duración del turno es inválida. Debe ser mayor a 0 y de a intervalos de 5 minutos"
      });
      return;
    }

    this.setState({ errorVisible: false, cargando: true }, () => {
      Rules_Turnero.actualizarDatosDuracion({
        id: this.props.id,
        fechaInicio: DateUtils.toDateString(fechaInicio),
        fechaFin: DateUtils.toDateString(fechaFin),
        duracionTurno: duracionTurno
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Turnero editado correctamente" });
          this.setState({ cargando: false }, () => {
            this.onClose(null, data);
          });
        })
        .catch(error => {
          this.setState({ cargando: false, errorVisible: true, errorMensaje: error });
        });
    });
  };

  callbackForm = callback => {
    this.callback = callback;
  };

  render() {
    const { visible } = this.props;
    const { cargando, errorVisible, errorMensaje, data } = this.state;

    let inputs = [
      {
        key: "fechaInicio",
        type: "date",
        label: "Fecha de Inicio",
        disabled: data && data.publicado
      },
      {
        key: "fechaFin",
        type: "date",
        label: "Fecha de Fin",
        disabled: data && data.publicado
      },
      {
        key: "duracionTurno",
        type: "number",
        label: "Duración de cada turno",
        disabled: data && data.publicado,
        inputProps: { endAdornment: <InputAdornment position="end">min</InputAdornment> }
      }
    ];

    return (
      <React.Fragment>
        <DialogoForm
          titulo="Editar duración de turnero"
          inputs={inputs}
          cargando={cargando || false}
          banerVisible={errorVisible || false}
          banerMensaje={errorMensaje || ""}
          banerBotonVisible={true}
          onBanerBotonClick={this.onBanerBotonClick}
          visible={visible}
          onClose={this.onClose}
          textoSi="Guardar cambios"
          textoNo="Cancelar"
          autoCerrarBotonSi={false}
          onBotonSiClick={this.guardar}
          callback={this.callbackForm}
        />
      </React.Fragment>
    );
  }
}

let componente = DialogoTurneroEditarDuracion;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
