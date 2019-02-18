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
import IconDeleteOutlined from "@material-ui/icons/DeleteOutlineOutlined";
import IconEditOutlined from "@material-ui/icons/EditOutlined";
import IconAddOutlined from "@material-ui/icons/AddOutlined";
import IconLinkOutlined from "@material-ui/icons/LinkOutlined";

//Mis componentes
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";
import MiBaner from "@Componentes/MiBaner";
import DialogoAgregarLink from "../_Dialogos/TurneroAgregarLink";
import DialogoRequisitoNuevo from "../_Dialogos/TurneroRequisitoNuevo";
import DialogoRequisitoEditar from "../_Dialogos/TurneroRequisitoEditar";
import DialogoRequisitoLinkNuevo from "../_Dialogos/TurneroRequisitoLinkNuevo";
import DialogoDatosBasicosEditar from "../_Dialogos/TurneroDatosBasicosEditar";
import DialogoUbicacionNuevo from "../_Dialogos/TurneroUbicacionNuevo";
import DialogoSelectorUsuario from "../_Dialogos/SelectorUsuario";
import UsuarioDetalle from "@Componentes/MiUsuarioDetalle";

//Rules
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

class TurneroFicha extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos() {
    var id = this.props.match.params.id;

    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Turnero.getDetalle(id)
        .then(data => {
          this.setState(
            {
              data: data
            },
            () => {
              setTimeout(() => {
                this.setState({ cardVisible: true });
              }, 300);
            }
          );
        })
        .catch(error => {
          this.setState({ errorVisible: true, errorMensaje: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.buscarDatos();
    }
  }

  onErrorClose = () => {
    this.setState({ errorVisible: false });
  };

  onToolbarTituloClick = () => {
    // this.props.redireccionar("/SeleccionarEntidad");
  };

  //Editar datos basicos
  onBotonEditarDatosBasicosClick = () => {
    this.mostrarDialogoDatosBasicosEditar();
  };

  mostrarDialogoDatosBasicosEditar = () => {
    this.setState({ dialogoDatosBasicosEditarVisible: true });
  };

  onDialogoDatosBasicosEditarClose = datos => {
    if (datos) {
      this.buscarDatos();
    }
    this.setState({ dialogoDatosBasicosEditarVisible: false });
  };

  //Ubicaicon nuevo
  onBotonUbicacionNuevoClick = () => {
    this.mostrarDialogoUbicacionNuevo();
  };

  mostrarDialogoUbicacionNuevo = () => {
    this.setState({ dialogoUbicacionNuevoVisible: true });
  };

  onDialogoUbicacionNuevoClose = data => {
    console.log(data);

    if (data) {
      this.buscarDatos();
    }

    this.setState({ dialogoUbicacionNuevoVisible: false });
  };

  //Ubicacion borrar
  onBotonUbicacionBorrarClick = () => {
    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.borrarUbicacion(this.state.data.id)
          .then(() => {
            this.buscarDatos();
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
  //Requisito nuevo
  onBotonRequisitoNuevoClick = () => {
    this.mostrarDialogoRequisitoNuevo();
  };

  mostrarDialogoRequisitoNuevo = () => {
    this.setState({ dialogoRequisitoNuevoVisible: true });
  };

  onDialogoRequisitoNuevoClose = data => {
    if (data != undefined) {
      this.buscarDatos();
    }
    this.setState({ dialogoRequisitoNuevoVisible: false });
  };

  //Requisito editar
  onBotonRequisitoEditarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoRequisitoEditar(id);
  };

  mostrarDialogoRequisitoEditar = id => {
    this.setState({ dialogoRequisitoEditarVisible: true, dialogoRequisitoEditarIdRequisito: id });
  };

  onDialogoRequisitoEditarClose = data => {
    if (data != undefined) {
      this.buscarDatos();
    }
    this.setState({ dialogoRequisitoEditarVisible: false });
  };

  //Requisito borrar
  onBotonRequisitoBorrarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;

    this.setState(
      {
        cargando: true
      },
      () => {
        Rules_Turnero.borrarRequisito({
          id: id,
          idTurnero: this.state.data.id
        })
          .then(() => {
            this.props.mostrarAlertaVerde({ texto: "Requisito eliminado correctamente" });
            this.buscarDatos();
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

  //Requisito link nuevo
  onBotonRequisitoLinkNuevoClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoRequisitoLinkNuevo(id);
  };

  mostrarDialogoRequisitoLinkNuevo = id => {
    this.setState({ dialogoRequisitoLinkNuevoVisible: true, dialogoRequisitoLinkNuevoIdRequisito: id });
  };

  onDialogoRequisitoLinkNuevoClose = data => {
    if (data != undefined) {
      this.buscarDatos();
    }
    this.setState({ dialogoRequisitoLinkNuevoVisible: false });
  };

  //Requisito link borrar
  onBotonRequisitoLinkBorrarClick = e => {
    var idRequisito = e.currentTarget.attributes["data-id-requisito"].value;
    var idLink = e.currentTarget.attributes["data-id-link"].value;

    this.setState({ cargando: true }, () => {
      Rules_Turnero.borrarRequisitoLink({
        idLink: idLink,
        idRequisito: idRequisito,
        idTurnero: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Link borrado correctamente" });
          this.buscarDatos();
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  //Link agregar
  onBotonAgregarLinkClick = () => {
    this.mostrarDialogoAgregarLink();
  };

  mostrarDialogoAgregarLink = () => {
    this.setState({ dialogoAgregarLinkVisible: true });
  };

  onDialogoAgregarLinkClose = data => {
    if (data != undefined) {
      this.buscarDatos();
    }
    this.setState({ dialogoAgregarLinkVisible: false });
  };

  //Link borrar
  onBotonLinkBorrarClick = e => {
    var id = e.currentTarget.attributes["data-id"].value;
    this.setState({ cargando: true }, () => {
      Rules_Turnero.borrarLink({
        idLink: id,
        idTurnero: this.state.data.id
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Link borrado correctamente" });
          this.buscarDatos();
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  //Usuario seleccionado
  onBotonUsuarioAsociadoClick = () => {
    this.setState({ dialogoSelectorUsuarioVisible: true });
  };

  onDialogoUsuarioSeleccionado = usuario => {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.agregarUsuarioAsociado({ idTurnero: this.state.data.id, idUsuario: usuario.id })
        .then(() => {
          this.buscarDatos();
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
    this.onDialogoSelectorUsuarioClose();
  };

  onDialogoSelectorUsuarioClose = () => {
    this.setState({ dialogoSelectorUsuarioVisible: false });
  };

  onBotonUsuarioAsociadoBorrarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ cargando: true }, () => {
      Rules_Turnero.borrarUsuarioAsociado({ idTurnero: this.state.data.id, idUsuario: id })
        .then(() => {
          this.buscarDatos();
        })
        .catch(error => {
          this.props.mostrarAlertaRoja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  render() {
    const { classes } = this.props;
    const { data } = this.state;

    var breadcrumbs = [];
    if (data) {
      breadcrumbs.push({
        titulo: "Entidad",
        texto: data.entidadNombre,
        url: `/Entidad/${data.entidadId}`
      });
      breadcrumbs.push({
        titulo: "Trámite",
        texto: data.tramiteNombre,
        url: `/Tramite/${data.entidadId}/${data.tramiteId}`
      });
      breadcrumbs.push({
        titulo: "Turnero",
        texto: data.nombre,
        url: ``
      });
    }

    var tieneUbicacion = data && data.ubicaciones && data.ubicaciones.length != 0;
    var tieneLinks = data && data.links && data.links.length != 0;
    var tieneRequisitos = data && data.requisitos && data.requisitos.length != 0;
    var tieneUsuarioAsociados = data && data.usuariosAsociados && data.usuariosAsociados.length != 0;

    var urlMapa = "";
    var tieneMapa = false;
    if (tieneUbicacion && data.ubicaciones[0].latitud && data.ubicaciones[0].latitud) {
      tieneMapa = true;
      let lat = data.ubicaciones[0].latitud.replace(",", ".");
      let lng = data.ubicaciones[0].longitud.replace(",", ".");
      urlMapa = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&scale=false&size=300x300&maptype=roadmap&key=${
        window.Config.GOOGLE_STATIC_MAP_KEY
      }&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${lat},${lng}`;
    }

    return (
      <React.Fragment>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" />

        <_MiPagina breadcrumbs={breadcrumbs} cargando={this.state.cargando} onToolbarTituloClick={this.onToolbarTituloClick}>
          <React.Fragment>
            <MiBaner
              visible={this.state.errorVisible}
              modo="error"
              mensaje={this.state.errorMensaje}
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

                          <Button color="primary" onClick={this.onBotonEditarDatosBasicosClick} style={{ marginLeft: 16 }}>
                            <IconEditOutlined style={{ marginRight: 8 }} />
                            Editar
                          </Button>
                        </Typography>

                        {/* Descripcion */}
                        <Typography variant="body1">{data.descripcion}</Typography>
                      </Grid>

                      {/* Ubicacion */}
                      <Grid item xs={12} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="title">Ubicación</Typography>
                          <Button color="primary" onClick={this.onBotonUbicacionNuevoClick} style={{ marginLeft: 16 }}>
                            {tieneUbicacion ? (
                              <IconEditOutlined style={{ marginRight: 8 }} />
                            ) : (
                              <IconAddOutlined style={{ marginRight: 8 }} />
                            )}
                            {tieneUbicacion ? "Editar" : "Agregar"}
                          </Button>
                        </div>

                        {!tieneUbicacion && <Typography variant="body1">No registro aún la ubicación de su turnero</Typography>}
                        {tieneUbicacion && (
                          <div className={classes.ubicacion}>
                            {tieneMapa && <div className="mapa" style={{ backgroundImage: `url(${urlMapa})` }} />}
                            <div className="textos">
                              <Typography variant="body2">{data.ubicaciones[0].nombre}</Typography>
                              <Typography variant="body1">{data.ubicaciones[0].direccion}</Typography>
                              <Button variant="outlined" onClick={this.onBotonUbicacionBorrarClick}>
                                Quitar ubicación
                              </Button>
                            </div>
                          </div>
                        )}
                      </Grid>

                      {/* Requisitos */}
                      <Grid item xs={12} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="title">Requisitos</Typography>
                          <Button color="primary" onClick={this.onBotonRequisitoNuevoClick} style={{ marginLeft: 16 }}>
                            <IconAddOutlined style={{ marginRight: 8 }} />
                            Agregar
                          </Button>
                        </div>
                        {!tieneRequisitos && <Typography variant="body1">No registró ningun requisito</Typography>}
                        {tieneRequisitos &&
                          data.requisitos.map(requisito => {
                            return (
                              <div className={classes.requisito} key={requisito.id}>
                                <div className="textos">
                                  <Typography variant="body2">{requisito.nombre}</Typography>
                                  <Typography variant="body1">{requisito.descripcion}</Typography>

                                  {requisito.links && requisito.links.length != 0 && (
                                    <div>
                                      {requisito.links.map(link => {
                                        return (
                                          <div className="link" key={link.id}>
                                            <div className="textos">
                                              <Typography component="a" target="_blank" href={link.url} variant="body1" className="texto">
                                                {link.alias}
                                              </Typography>
                                            </div>
                                            <div className="botones">
                                              <Tooltip title="Borrar link" disableFocusListener={true}>
                                                <IconButton
                                                  className="boton"
                                                  data-id-requisito={requisito.id}
                                                  data-id-link={link.id}
                                                  onClick={this.onBotonRequisitoLinkBorrarClick}
                                                >
                                                  <IconDeleteOutlined style={{ fontSize: 20 }} />
                                                </IconButton>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <div className="botones">
                                  <Tooltip title="Agregar link" disableFocusListener={true}>
                                    <IconButton className="boton" data-id={requisito.id} onClick={this.onBotonRequisitoLinkNuevoClick}>
                                      <IconLinkOutlined />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Editar requisito" disableFocusListener={true}>
                                    <IconButton className="boton" data-id={requisito.id} onClick={this.onBotonRequisitoEditarClick}>
                                      <IconEditOutlined />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Borrar requisito" disableFocusListener={true}>
                                    <IconButton className="boton" data-id={requisito.id} onClick={this.onBotonRequisitoBorrarClick}>
                                      <IconDeleteOutlined />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            );
                          })}
                      </Grid>

                      {/* Links */}
                      <Grid item xs={12} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="title">Links</Typography>
                          <Button color="primary" onClick={this.onBotonAgregarLinkClick} style={{ marginLeft: 16 }}>
                            <IconAddOutlined style={{ marginRight: 8 }} />
                            Agregar
                          </Button>
                        </div>
                        {!tieneLinks && <Typography variant="body1">No registró ningun link</Typography>}
                        {tieneLinks &&
                          data.links.map(link => {
                            return (
                              <div className={classes.link} key={link.id}>
                                <div className="textos">
                                  <Typography variant="body1">{link.alias}</Typography>
                                  <Typography variant="body1" component="a" target="_blank" href={link.url}>
                                    {link.url}
                                  </Typography>
                                </div>

                                <div className="botones">
                                  <IconButton className="boton" data-id={link.id} onClick={this.onBotonLinkBorrarClick}>
                                    <IconDeleteOutlined />
                                  </IconButton>
                                </div>
                              </div>
                            );
                          })}
                      </Grid>

                      {/* Personas asociadas */}
                      <Grid item xs={12} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="title">Personas asociadas</Typography>
                          <Button color="primary" onClick={this.onBotonUsuarioAsociadoClick} style={{ marginLeft: 16 }}>
                            <IconAddOutlined style={{ marginRight: 8 }} />
                            Agregar
                          </Button>
                        </div>
                        {!tieneUsuarioAsociados && <Typography variant="body1">No registró ninguna persona asociada</Typography>}
                        {tieneUsuarioAsociados &&
                          data.usuariosAsociados.map(usuario => {
                            console.log(usuario);
                            return (
                              <div key={usuario.id} className={classes.usuario}>
                                <div className={"contenedorInfo"}>
                                  <UsuarioDetalle key={usuario.id} data={usuario} />
                                </div>

                                <div className="botones">
                                  <Tooltip title="Quitar usuario asociado" disableFocusListener={true}>
                                    <IconButton data-id={usuario.id} onClick={this.onBotonUsuarioAsociadoBorrarClick}>
                                      <IconDeleteOutlined />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            );
                          })}
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
        {this.renderDialogoAgregarLink()}
        {this.renderDialogoRequisitoNuevo()}
        {this.renderDialogoRequisitoLinkNuevo()}
        {this.renderDialogoRequisitoEditar()}
        {this.renderDialogoDatosBasicosEditar()}
        {this.renderDialogoUbicacionNuevo()}
        {this.renderDialogoSelectorUsuario()}
      </React.Fragment>
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

  renderDialogoAgregarLink() {
    if (this.state.data == null) return null;

    return (
      <DialogoAgregarLink
        visible={this.state.dialogoAgregarLinkVisible || false}
        onClose={this.onDialogoAgregarLinkClose}
        id={this.state.data.id}
      />
    );
  }

  renderDialogoRequisitoNuevo() {
    if (this.state.data == null) return null;

    return (
      <DialogoRequisitoNuevo
        visible={this.state.dialogoRequisitoNuevoVisible || false}
        onClose={this.onDialogoRequisitoNuevoClose}
        id={this.state.data.id}
      />
    );
  }

  renderDialogoRequisitoLinkNuevo() {
    if (this.state.data == null) return null;

    return (
      <DialogoRequisitoLinkNuevo
        visible={this.state.dialogoRequisitoLinkNuevoVisible || false}
        onClose={this.onDialogoRequisitoLinkNuevoClose}
        idTurnero={this.state.data.id}
        idRequisito={this.state.dialogoRequisitoLinkNuevoIdRequisito || -1}
      />
    );
  }

  renderDialogoRequisitoEditar() {
    if (this.state.data == null) return null;

    return (
      <DialogoRequisitoEditar
        visible={this.state.dialogoRequisitoEditarVisible || false}
        onClose={this.onDialogoRequisitoEditarClose}
        idTurnero={this.state.data.id}
        idRequisito={this.state.dialogoRequisitoEditarIdRequisito || -1}
      />
    );
  }

  renderDialogoDatosBasicosEditar() {
    if (this.state.data == null) return null;

    return (
      <DialogoDatosBasicosEditar
        visible={this.state.dialogoDatosBasicosEditarVisible || false}
        onClose={this.onDialogoDatosBasicosEditarClose}
        id={this.state.data.id}
      />
    );
  }

  renderDialogoUbicacionNuevo() {
    if (this.state.data == null) return null;

    return (
      <DialogoUbicacionNuevo
        visible={this.state.dialogoUbicacionNuevoVisible || false}
        onClose={this.onDialogoUbicacionNuevoClose}
        id={this.state.data.id}
      />
    );
  }

  renderDialogoSelectorUsuario() {
    if (this.state.data == null) return null;

    return (
      <DialogoSelectorUsuario
        visible={this.state.dialogoSelectorUsuarioVisible || false}
        onClose={this.onDialogoSelectorUsuarioClose}
        onUsuarioSeleccionado={this.onDialogoUsuarioSeleccionado}
      />
    );
  }
}

let componente = TurneroFicha;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
