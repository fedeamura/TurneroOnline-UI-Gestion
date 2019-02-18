import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";
import { push } from "connected-react-router";

//Componentes
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import IconButton from "@material-ui/core/IconButton";
import IconDeleteOutlineOutlined from "@material-ui/icons/DeleteOutlineOutlined";
import IconEditOutlined from "@material-ui/icons/EditOutlined";
import IconAddOutlined from "@material-ui/icons/AddOutlined";
import IconCalendarTodayOutlined from "@material-ui/icons/CalendarTodayOutlined";
import IconTodayOutlined from "@material-ui/icons/TodayOutlined";

//Mis componentes
import DialogoForm from "@Componentes/MiDialogoForm";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";
import MiBaner from "@Componentes/MiBaner";
import DialogoTurneroNuevo from "../_Dialogos/TurneroNuevo";
// import DialogoTurneroEditarDuracion from "../_Dialogos/TurneroEditarDuracion";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";
import Rules_TramitePorEntidad from "@Rules/Rules_TramitePorEntidad";
import Rules_Turnero from "@Rules/Rules_Turnero";
import { Tooltip } from "@material-ui/core";

const mapStateToProps = state => {
  return {
    token: state.Usuario.token
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  mostrarAlertaVerde: data => {
    dispatch(mostrarAlertaVerde(data));
  },
  mostrarAlertaRoja: data => {
    dispatch(mostrarAlertaRoja(data));
  },
  mostrarAlertaNaranja: data => {
    dispatch(mostrarAlertaNaranja(data));
  }
});

class TramiteDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idEntidad: props.match.params.idEntidad,
      idTramite: props.match.params.idTramite,

      cargando: true,
      cardVisible: false,
      data: undefined,
      error: undefined
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos() {
    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Entidad.getDetalle(this.state.idEntidad)
        .then(data => {
          let tramite = _.find(data.tramites, tramite => {
            return tramite.id == this.state.idTramite;
          });
          this.setState(
            {
              dataEntidad: data,
              error: undefined,
              data: tramite
            },
            () => {
              setTimeout(() => {
                this.setState({ cardVisible: true });
              }, 300);
            }
          );
        })
        .catch(error => {
          this.setState({ errorVisible: true, error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.match.params.idEntidad != nextProps.match.params.idEntidad ||
      this.props.match.params.idTramite != nextProps.match.params.idTramite
    ) {
      this.setState({ idEntidad: nextProps.match.params.idEntidad, idTramite: nextProps.match.params.idTramite }, () => {
        this.buscarDatos();
      });
    }
  }

  onErrorClose = () => {
    this.setState({ errorVisible: false });
  };

  onToolbarTituloClick = () => {
    this.props.redireccionar("/SeleccionarEntidad");
  };

  //Editar tramite
  onBotonEditarClick = () => {
    this.mostrarDialogoEditar();
  };

  mostrarDialogoEditar = () => {
    this.setState({
      dialogoEditarVisible: true,
      dialogoEditarErrorVisible: false,
      dialogoEditarCargando: false
    });
  };

  onDialogoEditarClose = () => {
    let cargando = this.state.dialogoEditarCargando || false;
    if (cargando == true) return;

    this.setState({ dialogoEditarVisible: false });
  };

  onDialogoEditarBotonSiClick = dataNueva => {
    const { nombre, descripcion } = dataNueva;
    if (nombre.trim() == "") {
      this.setState({
        dialogoEditarErrorVisible: true,
        dialogoEditarError: "Ingrese el nombre"
      });
      return;
    }

    if (descripcion.trim() == "") {
      this.setState({
        dialogoEditarErrorVisible: true,
        dialogoEditarError: "Ingrese la descripción"
      });
      return;
    }

    this.setState({ dialogoEditarCargando: true, dialogoEditarErrorVisible: false }, () => {
      Rules_TramitePorEntidad.actualizar({
        id: this.state.idTramite,
        nombre: nombre,
        descripcion: descripcion
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Datos del trámite modificados correctamente" });
          this.buscarDatos();
          this.setState({ dialogoEditarVisible: false });
        })
        .catch(error => {
          this.setState({ dialogoEditarErrorVisible: true, dialogoEditarError: error, dialogoEditarCargando: false });
        });
    });
  };

  //Tunero nuevo
  onBotonTurneroNuevoClick = e => {
    const { data } = this.state;

    let turneroNoPublicado = _.find(data.turneros, turnero => {
      return turnero.publicado == false;
    });

    if (turneroNoPublicado) {
      this.mostrarDialogoMensaje(
        "Ya tiene un turnero no publicado para el tramite seleccionado. No puede crear un turnero nuevo hasta que publique el turnero en borrador."
      );
      return;
    }

    this.mostrarDialogoTuneroNuevo();
  };

  mostrarDialogoTuneroNuevo = () => {
    this.setState({ dialogoTurneroNuevoVisible: true });
  };

  onDialogoTurneroNuevoClose = turnero => {
    this.setState({ dialogoTurneroNuevoVisible: false });
    if (turnero != undefined) {
      this.buscarDatos();
    }
  };

  // Turnero borrar
  onBotonTurneroBorrarClick = e => {
    var idTurnero = e.currentTarget.attributes["data-id"].value;

    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.getCantidadTurnosReservados(idTurnero)
          .then(cantidad => {
            let mensaje = "";

            if (cantidad == 0) {
              mensaje = "¿Esta seguro que desea borrar el turnero? Esta accion no se puede deshacer.";
            } else {
              if (cantidad == 1) {
                mensaje =
                  "El turnero tiene 1 turno ya reservado. Si borra el turnero el turno se cancelará. ¿Desea continuar? Esta acción no se puede deshacer.";
              } else {
                mensaje =
                  "El turnero tiene " +
                  cantidad +
                  " turnos ya reservados. Si borra el turnero los turnos se cancelarán. ¿Desea continuar? Esta acción no se puede deshacer.";
              }
            }

            this.mostrarDialogoTurneroBorrar(mensaje, idTurnero);
          })
          .catch(error => {
            this.props.mostrarAlertaRoja({ texto: error });
          })
          .finally(() => {
            this.setState({ cargando: false });
          });
      }
    );
  };

  mostrarDialogoTurneroBorrar = (texto, idTurnero) => {
    this.setState({
      dialogoTurneroBorrarVisible: true,
      dialogoTurneroBorrarId: idTurnero,
      dialogoTurneroBorrarCargando: false,
      dialogoTurneroBorrarErrorVisible: false,
      dialogoTurneroBorrarMensaje: texto
    });
  };

  onDialogoTurneroBorrarClose = () => {
    let cargando = this.state.dialogoTurneroBorrarCargando || false;
    if (cargando == true) return;
    this.setState({ dialogoTurneroBorrarVisible: false });
  };

  onDialogoTurneroBorrarBotonSiClick = () => {
    this.borrarTurnero();
  };

  borrarTurnero = () => {
    this.setState({ dialogoTurneroBorrarCargando: true, dialogoTurneroBorrarErrorVisible: false }, () => {
      Rules_Turnero.borrar(this.state.dialogoTurneroBorrarId)
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turnero borrado correctamente" });
          this.setState({ dialogoTurneroBorrarVisible: false });
          this.buscarDatos();
        })
        .catch(error => {
          this.setState({
            dialogoTurneroBorrarErrorVisible: true,
            dialogoTurneroBorrarError: error,
            dialogoTurneroBorrarCargando: false
          });
        });
    });
  };

  //Mensaje
  mostrarDialogoMensaje = mensaje => {
    this.setState({
      dialogoMensajeVisible: true,
      dialogoMensajeCargando: false,
      dialogoMensajeErrorVisible: false,
      dialogoMensajeMensaje: mensaje
    });
  };

  onDialogoMensajeClose = () => {
    let cargando = this.state.dialogoMensajeCargando || false;
    if (cargando == true) return;
    this.setState({ dialogoMensajeVisible: false });
  };

  //Editar borrador
  onBotonTurneroBorradorEditarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.props.redireccionar("/TurneroBorrador/" + id);
  };

  onBotonTurneroBorradorClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ cargando: true }, () => {
      Rules_Turnero.setBorrador(id)
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Turnero en borrador" });
          this.props.redireccionar("/TurneroBorrador/" + id);
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onBotonEntidadClick = () => {
    this.props.redireccionar("/Entidad/" + this.state.dataEntidad.id);
  };

  //Editar ficha
  onBotonTurneroFichaClick = (e) => {
    var id = e.currentTarget.attributes['data-id'].value;
    this.props.redireccionar("/TurneroFicha/" + id);
  };

  render() {
    const { classes } = this.props;
    const { data, dataEntidad } = this.state;

    var breadcrumbs = [];
    if (dataEntidad) {
      breadcrumbs.push({
        titulo: "Entidad",
        texto: dataEntidad.nombre,
        url: "/Entidad/" + dataEntidad.id
      });
      breadcrumbs.push({
        titulo: "Trámite",
        texto: data.nombre,
        url: ""
      });
    }

    return (
      <React.Fragment>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" />

        <_MiPagina breadcrumbs={breadcrumbs} cargando={this.state.cargando} onToolbarTituloClick={this.onToolbarTituloClick}>
          <React.Fragment>
            <MiBaner
              visible={this.state.errorVisible}
              modo="error"
              mensaje={this.state.error}
              className={classes.contenedorError}
              mostrarBoton={true}
              onBotonClick={this.onErrorClose}
            />

            <React.Fragment>
              {data != undefined && (
                <React.Fragment>
                  <MiCard rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
                    <Grid container spacing={16}>
                      {/* Contenido principal */}
                      <Grid item xs={12}>
                        {/* Nombre */}
                        <Typography variant="display1">
                          {data.nombre}

                          <Button color="primary" onClick={this.onBotonEditarClick} style={{ marginLeft: 16 }}>
                            <IconEditOutlined style={{ marginRight: 8 }} />
                            Editar
                          </Button>
                        </Typography>

                        {/* Descripcion */}
                        <Typography variant="body1">{data.descripcion}</Typography>
                      </Grid>

                      {/* Turneros */}
                      <Grid item xs={12} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="title">Turneros</Typography>
                          <Button color="primary" onClick={this.onBotonTurneroNuevoClick} style={{ marginLeft: 16 }}>
                            <IconAddOutlined style={{ marginRight: 8 }} />
                            Nuevo
                          </Button>
                        </div>

                        {(data.turneros == undefined || data.turneros.length == 0) && (
                          <Typography variant="body1">No hay turneros registrados</Typography>
                        )}
                        {/* Turneros en borrador */}
                        {data.turneros && data.turneros.length != 0 && (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            {data.turneros.map((turnero, index) => {
                              if (turnero.publicado == true) return null;
                              return (
                                <div
                                  key={"borrador " + turnero.id + ""}
                                  data-id={turnero.id}
                                  className={classNames(classes.contenedorTurnero, "borrador")}
                                >
                                  <div className="textos">
                                    <Typography variant="body1" className="texto">
                                      {turnero.nombre}
                                    </Typography>
                                    <Typography variant="caption" className="texto">
                                      (Turnero en borrador)
                                    </Typography>
                                  </div>
                                  <div className={"contenedorBotones"}>
                                    <Tooltip disableFocusListener={true} title="Editar ficha">
                                      <IconButton
                                        className="boton"
                                        style={{ marginLeft: 8 }}
                                        data-id={turnero.id}
                                        onClick={this.onBotonTurneroFichaClick}
                                      >
                                        <IconEditOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip disableFocusListener={true} title="Editar programación">
                                      <IconButton
                                        data-id={turnero.id}
                                        onClick={this.onBotonTurneroBorradorEditarClick}
                                        className="boton"
                                        style={{ marginLeft: 8 }}
                                      >
                                        <IconTodayOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip disableFocusListener={true} title="Descartar borrador">
                                      <IconButton className="boton" onClick={this.onBotonTurneroBorrarClick} data-id={turnero.id}>
                                        <IconDeleteOutlineOutlined />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Turneros publicados */}
                        {data.turneros && data.turneros.length != 0 && (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            {data.turneros.map((turnero, index) => {
                              if (turnero.publicado != true) return null;
                              return (
                                <div
                                  key={"publicado" + turnero.id + ""}
                                  data-id={turnero.id}
                                  className={classNames(classes.contenedorTurnero)}
                                >
                                  <div className="textos">
                                    <Typography variant="body1" className="texto">
                                      {turnero.nombre}
                                    </Typography>
                                  </div>
                                  <div className={"contenedorBotones"}>
                                    <Tooltip disableFocusListener={true} title="Editar ficha">
                                      <IconButton
                                        className="boton"
                                        style={{ marginLeft: 8 }}
                                        data-id={turnero.id}
                                        onClick={this.onBotonTurneroFichaClick}
                                      >
                                        <IconEditOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip disableFocusListener={true} title="Poner en borrador">
                                      <IconButton
                                        data-id={turnero.id}
                                        className="boton"
                                        style={{ marginLeft: 8 }}
                                        onClick={this.onBotonTurneroBorradorClick}
                                      >
                                        <IconCalendarTodayOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip disableFocusListener={true} title="Borrar turnero">
                                      <IconButton className="boton" data-id={turnero.id} onClick={this.onBotonTurneroBorrarClick}>
                                        <IconDeleteOutlineOutlined />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </MiCard>
                </React.Fragment>
              )}
            </React.Fragment>
          </React.Fragment>
        </_MiPagina>

        {this.renderDialogos()}
      </React.Fragment>
    );
  }

  renderDialogos() {
    return (
      <React.Fragment>
        {this.renderDialogoMensaje()}
        {this.renderDialogoTramiteEditar()}
        {this.renderDialogoTurneroBorrar()}
        {this.renderDialogoTurneroNuevo()}
        {this.renderDialogoTurneroEditarFicha()}
      </React.Fragment>
    );
  }

  renderDialogoTramiteEditar() {
    const { data } = this.state;
    if (data == undefined) return null;

    return (
      <DialogoForm
        titulo="Editar trámite"
        inputs={[
          { key: "nombre", label: "Nombre", value: data.nombre },
          { key: "descripcion", label: "Descripción", multiline: true, value: data.descripcion }
        ]}
        cargando={this.state.dialogoEditarCargando || false}
        visible={this.state.dialogoEditarVisible || false}
        mostrarBaner={this.state.dialogoEditarErrorVisible || false}
        textoBaner={this.state.dialogoEditarError}
        onClose={this.onDialogoEditarClose}
        textoSi="Guardar"
        textoNo="Cancelar"
        onBotonSiClick={this.onDialogoEditarBotonSiClick}
        autoCerrarBotonSi={false}
      />
    );
  }

  renderDialogoMensaje() {
    return (
      <DialogoMensaje
        visible={this.state.dialogoMensajeVisible || false}
        cargando={this.state.dialogomensajeCargando || false}
        mensaje={this.state.dialogoMensajeMensaje || ""}
        onClose={this.onDialogoMensajeClose}
        textoSi="Aceptar"
        botonNoVisible={false}
      />
    );
  }
  renderDialogoTurneroBorrar() {
    return (
      <DialogoMensaje
        titulo="Confirmar borrar turnero"
        visible={this.state.dialogoTurneroBorrarVisible || false}
        cargando={this.state.dialogoTurneroBorrarCargando || false}
        mensaje={this.state.dialogoTurneroBorrarMensaje || ""}
        onClose={this.onDialogoTurneroBorrarClose}
        textoSi="Borrar turnero"
        autoCerrarBotonSi={false}
        onBotonSiClick={this.onDialogoTurneroBorrarBotonSiClick}
      />
    );
  }

  renderDialogoTurneroNuevo() {
    return (
      <DialogoTurneroNuevo
        visible={this.state.dialogoTurneroNuevoVisible || false}
        onClose={this.onDialogoTurneroNuevoClose}
        idTramite={this.state.idTramite}
      />
    );
  }

  renderDialogoTurneroEditarFicha() {
    return null;
  }
}

let componente = TramiteDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
