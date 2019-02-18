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

class DialogoTurneroNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible == true) {
      this.setState({ errorVisible: false, cargando: false });
    }
  }

  onClose = (e, turnero) => {
    if (this.state.cargando == true) return;
    this.props.onClose && this.props.onClose(turnero);
  };

  onBanerBotonClick = () => {
    this.setState({ errorVisible: false });
  };

  guardar = data => {
    let { nombre, descripcion, fechaInicio, fechaFin, duracionTurno } = data;

    if (StringUtils.isEmpty(nombre)) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese el nombre"
      });
      return;
    }

    if (StringUtils.isEmpty(descripcion)) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese la descripción"
      });
      return;
    }

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
      Rules_Turnero.insertar({
        idTramite: this.props.idTramite,
        nombre: nombre,
        descripcion: descripcion,
        fechaInicio: DateUtils.toDateString(fechaInicio),
        fechaFin: DateUtils.toDateString(fechaFin),
        duracionTurno: duracionTurno
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Turnero registrado correctamente" });
          this.setState({ cargando: false }, () => {
            this.onClose(null, data);
          });
        })
        .catch(error => {
          this.setState({ cargando: false, errorVisible: true, errorMensaje: error });
        });
    });
  };

  render() {
    const { visible } = this.props;
    const { cargando, errorVisible, errorMensaje } = this.state;

    let inputs = [
      {
        key: "nombre",
        label: "Nombre"
      },
      {
        key: "descripcion",
        label: "Descripcion"
      },
      {
        key: "fechaInicio",
        type: "date",
        label: "Fecha de Inicio"
      },
      {
        key: "fechaFin",
        type: "date",
        label: "Fecha de Fin"
      },
      {
        key: "duracionTurno",
        type: "number",
        label: "Duración de cada turno",
        inputProps: { endAdornment: <InputAdornment position="end">min</InputAdornment> }
      }
    ];
    return (
      <React.Fragment>
        <DialogoForm
          titulo="Nuevo turnero"
          inputs={inputs}
          cargando={cargando || false}
          banerVisible={errorVisible || false}
          banerMensaje={errorMensaje || ""}
          banerBotonVisible={true}
          onBanerBotonClick={this.onBanerBotonClick}
          visible={visible || false}
          onClose={this.onClose}
          textoSi="Registrar"
          textoNo="Cancelar"
          autoCerrarBotonSi={false}
          onBotonSiClick={this.guardar}
        />
      </React.Fragment>
    );
  }
}

let componente = DialogoTurneroNuevo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
