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

class DialogoTurneroRequisitoEditar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible == true) {
      this.setState({ errorVisible: false, cargando: false });
      this.buscarDatos();
    }
  }

  buscarDatos = () => {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.getDetalle(this.props.idTurnero)
        .then(data => {
          var requisito = _.find(data.requisitos, item => {
            return item.id == this.props.idRequisito;
          });

          this.callback && this.callback.setValores([
            {
              key: 'nombre',
              value: requisito.nombre
            },
            {
              key: 'descripcion',
              value: requisito.descripcion
            }
          ])
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
      Rules_Turnero.actualizarRequisito({
        idTurnero: this.props.idTurnero,
        id: this.props.idRequisito,
        nombre: nombre,
        descripcion: descripcion
      })
        .then(data => {
          this.props.mostrarAlertaVerde({ texto: "Requisito editado correctamente" });
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
        label: "Titulo"
      },
      {
        key: "descripcion",
        label: "Descripción"
      }
    ];

    return (
      <React.Fragment>
        <DialogoForm
          titulo="Editar requisito"
          inputs={inputs}
          cargando={cargando || false}
          banerVisible={errorVisible || false}
          banerMensaje={errorMensaje || ""}
          banerBotonVisible={true}
          onBanerBotonClick={this.onBanerBotonClick}
          visible={visible || false}
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

let componente = DialogoTurneroRequisitoEditar;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
