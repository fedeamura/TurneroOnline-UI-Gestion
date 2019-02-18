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
import { Button, CircularProgress, DialogTitle } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

//Mis Componentes
import MiBaner from "@Componentes/MiBaner";
import HistorialEstado from "./HistorialEstado";

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

class DialogoTurnoHistorial extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      data: undefined,
      mostrarError: false,
      error: undefined
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible == true) {
        this.setState({ data: undefined, mostrarError: false });
        this.buscar(nextProps.idturno);
      }
    }
  }

  buscar = id => {
    this.setState({ cargando: true }, () => {
      Rules_Turno.getHistorialEstado({ id: id, idEntidad: this.props.rol.entidadId })
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
    this.props.onClose && this.props.onClose();
  };

  onBaneErrorClose = () => {
    this.setState({ mostrarError: false });
  };

  render() {
    const { classes, usuario, fullScreen } = this.props;

    return (
      <React.Fragment>
        <Dialog fullScreen={fullScreen} open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <MiBaner
            visible={this.state.mostrarError}
            mensaje={this.state.error}
            onClose={this.onBaneErrorClose}
            className={classes.contenedorError}
          />
          <DialogTitle>Historial de estados</DialogTitle>
          <DialogContent>
            {this.state.data &&
              this.state.data.map((item, index) => {
                return <HistorialEstado key={index} data={item} primero={index === 0} ultimo={index === this.state.data.length - 1} />;
              })}
          </DialogContent>

          <DialogActions>
            <Button color="primary" onClick={this.onClose} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
          <div className={classNames(classes.contenedorIndicadorCargando, this.state.cargando && "visible")}>
            <CircularProgress />
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

let componente = DialogoTurnoHistorial;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
