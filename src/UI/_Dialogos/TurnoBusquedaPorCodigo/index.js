import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import { Typography, Button, CircularProgress } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

//Mis Componentes
import DialogoInput from "@Componentes/MiDialogoInput";
import DialogoTurnoDetalle from "@UI/_Dialogos/TurnoDetalle";

import DateUtils from "@Componentes/Utils/Date";

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
  mostrarAlertaVerde: comando => {
    dispatch(mostrarAlertaVerde(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  }
});

class DialogoTurnoBusquedaPorCodigo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      cargando: false,
      error: "",
      errorVisible: "",
      data: undefined,
      detalleVisible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.visible != nextProps.visible) {
      this.setState({ visible: nextProps.visible });
      if (nextProps.visible == true) {
        this.setState({ cargando: false, errorVisible: false });
      }
    }
  }

  buscarPorCodigo = input => {
    if (input.indexOf("/") == -1) {
      this.setState({ errorVisible: true, error: "Formato  de codigo inválido" });
      return;
    }

    let partes = input.split("/");
    if (partes.length != 2) {
      this.setState({ errorVisible: true, error: "Formato  de codigo inválido" });
      return;
    }

    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Turno.getDetalleByCodigo({
        idEntidad: this.props.rol.entidadId,
        codigo: partes[0],
        año: partes[1]
      })
        .then(data => {
          this.props.onClose && this.props.onClose();
          this.setState({ data: data, detalleVisible: true, visible: false });
        })
        .catch(error => {
          this.setState({ errorVisible: true, error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onDialogoDetalleClose = turnoModificado => {
    this.setState({ detalleVisible: false });
    if (turnoModificado == true) {
      this.props.onTurnoModificado && this.props.onTurnoModificado();
    }
  };

  render() {
    const { classes, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <DialogoInput
          visible={this.state.visible}
          cargando={this.state.cargando}
          mostrarBaner={this.state.errorVisible}
          textoBaner={this.state.error}
          titulo="Buscar por código"
          placeholder="QAZWSX/2018"
          label="Código"
          textoSi="Buscar"
          onClose={this.props.onClose}
          textoNo="Cancelar"
          onBotonSiClick={this.buscarPorCodigo}
          autoCerrarBotonSi={false}
        />

        <DialogoTurnoDetalle
          visible={this.state.detalleVisible}
          idturno={this.state.data ? this.state.data.id : 0}
          onClose={this.onDialogoDetalleClose}
        />
      </React.Fragment>
    );
  }
}

let componente = DialogoTurnoBusquedaPorCodigo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
