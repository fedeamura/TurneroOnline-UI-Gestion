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

class DialogoTurneroRequisitoNuevo extends React.Component {
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
    let { nombre, descripcion } = data;

    if (StringUtils.isEmpty(nombre)) {
      this.setState({
        errorVisible: true,
        errorMensaje: "Ingrese el titulo"
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

    this.setState({ errorVisible: false, cargando: true }, () => {
      Rules_Turnero.agregarRequisito({
        idTurnero: this.props.id,
        nombre: nombre,
        descripcion: descripcion
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Requisito registrado correctamente" });
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
        label: "titulo"
      },
      {
        key: "descripcion",
        label: "Descripción"
      }
    ];
    return (
      <React.Fragment>
        <DialogoForm
          titulo="Agregar requisito en Turnero"
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

let componente = DialogoTurneroRequisitoNuevo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
