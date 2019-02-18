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

//Mis Componentes
import DialogoForm from "@Componentes/MiDialogoForm";
import StringUtils from "@Componentes/Utils/String";

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

class DialogoTurneroUbicacionNuevo extends React.Component {
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
            return;
          }

          if (data.ubicaciones != undefined && data.ubicaciones.length != 0) {
            let lat = data.ubicaciones[0].latitud;
            if (lat) {
              lat = lat.replace(".", ",");
            }

            let lng = data.ubicaciones[0].longitud;
            if (lng) {
              lng = lng.replace(".", ",");
            }

            this.callback &&
              this.callback.setValores([
                {
                  key: "nombre",
                  value: data.ubicaciones[0].nombre
                },
                {
                  key: "direccion",
                  value: data.ubicaciones[0].direccion || ""
                },
                {
                  key: "latitud",
                  value: lat || ""
                },
                {
                  key: "longitud",
                  value: lng || ""
                }
              ]);
          }

          // this.setState({ data: data });
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
    let { nombre, direccion, latitud, longitud } = data;

    if (StringUtils.isEmpty(nombre)) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese el nombre"
      });
      return;
    }

    if (StringUtils.isEmpty(direccion)) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese la descripción"
      });
      return;
    }

    if (!StringUtils.isEmpty(latitud)) {
      var tienePunto = latitud.indexOf(",") != -1;
      if (!tienePunto) {
        this.setState({
          errorVisible: true,
          errorMensaje: "Latitud inválida. Debe ser un numero decimal con coma"
        });
        return;
      }
    }

    if (!StringUtils.isEmpty(longitud)) {
      var tienePunto = longitud.indexOf(",") != -1;
      if (!tienePunto) {
        this.setState({
          errorVisible: true,
          errorMensaje: "Longitud inválida. Debe ser un numero decimal con coma"
        });
        return;
      }
    }

    if (StringUtils.isEmpty(latitud) != StringUtils.isEmpty(longitud)) {
      if (StringUtils.isEmpty(latitud)) {
        this.setState({
          errorVisible: true,
          errorMensaje: "Si ingresa la longitud debe ingresar la latitud"
        });
        return;
      }

      if (StringUtils.isEmpty(longitud)) {
        this.setState({
          errorVisible: true,
          errorMensaje: "Si ingresa la latitud debe ingresar la longitud"
        });
        return;
      }
    }
    this.setState({ errorVisible: false, cargando: true }, () => {
      Rules_Turnero.setUbicacion({
        idTurnero: this.props.id,
        nombre: nombre,
        direccion: direccion,
        latitud: latitud,
        longitud: longitud
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Ubicación registrada correctamente" });
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
    const { cargando, errorVisible, errorMensaje } = this.state;

    let inputs = [
      {
        key: "nombre",
        label: "Nombre"
      },
      {
        key: "direccion",
        label: "Dirección"
      },
      {
        key: "latitud",
        label: "Latitud"
      },
      {
        key: "longitud",
        label: "Longitud"
      }
    ];

    return (
      <React.Fragment>
        <DialogoForm
          titulo="Ubicación de turnero"
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

let componente = DialogoTurneroUbicacionNuevo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
