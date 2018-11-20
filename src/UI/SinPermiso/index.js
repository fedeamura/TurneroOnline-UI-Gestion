import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { cerrarSesion } from "@Redux/Actions/usuario";

//Componentes
import _ from "lodash";

//Mis componentes
import MiPanelMensaje from "@Componentes/MiPanelMensaje";

const mapStateToProps = state => {
  return {
    roles: state.Usuario.roles
  };
};

const mapDispatchToProps = dispatch => ({
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  }
});

class SinPermiso extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onBotonSalirClick = e => {
    this.props.cerrarSesion();
    window.location.href = window.Config.URL_LOGIN;
  };

  render() {
    return (
      <React.Fragment>
        <MiPanelMensaje mensaje="No tiene el permiso necesario para acceder al sistema" error boton="Salir" onBotonClick={this.onBotonSalirClick} />
      </React.Fragment>
    );
  }
}

let componente = SinPermiso;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
