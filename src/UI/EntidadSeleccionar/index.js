import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { goBack, push } from "connected-react-router";
import { seleccionarEntidad } from "@Redux/Actions/usuario";

//Componentes
import { Typography, Button } from "@material-ui/core";
import _ from "lodash";

//Mis componentes
import MiPagina from "../_MiPagina";
import MiContent from "@Componentes/MiContent";
import MiCard from "@Componentes/MiCard";

const mapStateToProps = state => {
  return {
    roles: state.Usuario.roles
  };
};

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(goBack());
  },
  seleccionarEntidad: id => {
    dispatch(seleccionarEntidad(id));
  },
  redirigir: url => {
    dispatch(push(url));
  }
});

class EntidadSeleccionar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onBotonTurneroClick = e => {
    let idEntidad = e.currentTarget.attributes.identidad.value;
    let idTurnero = e.currentTarget.attributes.idturnero.value;
    this.props.seleccionarEntidad(idEntidad);
    this.props.redirigir("/ConsultaTurnos/" + idTurnero);
  };

  onBotonGestionarClick = (e) => {
    let idEntidad = e.currentTarget.attributes["data-id"].value;
    this.props.seleccionarEntidad(idEntidad);
    this.props.redirigir("/Entidad/" + idEntidad);
  };

  render() {
    if (this.props.roles == undefined) return null;

    const { classes } = this.props;

    return (
      <React.Fragment>
        <MiPagina toolbarLeftIconVisible={false} onToolbarTituloClick={() => {}}>
          <Typography variant="display1" className={classes.titulo}>
            Seleccione un turnero
          </Typography>
          {this.props.roles.map((rol, index) => {
            return (
              <MiCard key={index} padding={false} rootClassName={classes.card} contentClassName={classes.cardContent}>
                <div className={classes.imagenEntidad} style={{ backgroundImage: `url(${rol.entidadUrl})` }} />
                <div className={classes.contenedorTextos} style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography style={{ flex: 1 }} variant="title">
                      {rol.entidadNombre}
                    </Typography>
                    <Button variant="outlined" data-id={rol.entidadId} onClick={this.onBotonGestionarClick}>
                      Gestionar
                    </Button>
                  </div>

                  <Typography variant="subheading">Rol: {rol.rolNombre}</Typography>

                  {rol.tramites.length == 0 && <Typography variant="body1">Sin tramites disponibles</Typography>}
                  {rol.tramites.map((tramite, indexTramite) => {
                    return (
                      <div key={indexTramite} style={{ marginTop: 16 }}>
                        <Typography variant="headline">{tramite.nombre}</Typography>

                        {tramite.turneros.length == 0 && <Typography variant="body1">Sin turneros disponibles</Typography>}
                        {tramite.turneros.map((turnero, indexTurnero) => {
                          return (
                            <div key={indexTurnero}>
                              <Typography
                                identidad={rol.entidadId}
                                idturnero={turnero.id}
                                className={classes.link}
                                onClick={this.onBotonTurneroClick}
                              >
                                {turnero.nombre}
                              </Typography>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </MiCard>
            );
          })}
        </MiPagina>
      </React.Fragment>
    );
  }
}

let componente = EntidadSeleccionar;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
