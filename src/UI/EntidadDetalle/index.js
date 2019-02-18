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

//Mis componentes
import DialogoForm from "@Componentes/MiDialogoForm";
import DialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";
import FotoUtils from "@Componentes/Utils/Foto";
import MiBaner from "@Componentes/MiBaner";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";
import Rules_TramitePorEntidad from "@Rules/Rules_TramitePorEntidad";

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

class EntidadDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: true,
      cardVisible: false,
      data: undefined,
      error: undefined,
      //Datos basicos,
      dialogoEditarVisible: false,
      dialogoEditarCargando: false,
      dialogoEditarErrorVisible: false,
      dialogoEditarError: undefined,
      //Link de interes nuevo
      dialogoLinkDeInteresNuevoVisible: false,
      dialogoLinkDeInteresNuevoError: undefined,
      dialogoLinkDeInteresNuevoErrorVisible: false,
      dialogoLinkDeInteresNuevoCargando: false,
      //Link de interes borrar
      dialogoLinkDeInteresBorrarConfirmacionVisible: false,
      dialogoLinkDeInteresBorrarConfirmacionError: undefined,
      dialogoLinkDeInteresBorrarConfirmacionErrorVisible: false,
      dialogoLinkDeInteresBorrarConfirmacionCargando: false,
      dialogoLinkDeInteresBorrarConfirmacionId: undefined,
      //Tramite nuevo
      dialogoTramiteNuevoVisible: false,
      dialogoTramiteNuevoCargando: false,
      dialogoTramiteNuevoErrorVisible: undefined,
      dialogoTramiteNuevoError: false,
      //Tramite Borrar Confirmacion,
      dialogoTramiteBorrarConfirmacionVisible: false,
      dialogoTramiteBorrarConfirmacionCargando: false,
      dialogoTramiteBorrarConfirmacionErrorVisible: false,
      dialogoTramiteBorrarConfirmacionError: undefined,
      dialogoTramiteBorrarConfirmacionId: undefined
    };
  }

  componentDidMount() {
    this.buscarDatos();
    this.filePicker.addEventListener("change", this.onFile, false);
  }

  buscarDatos() {
    this.setState({ cargando: true }, () => {
      Rules_Entidad.getDetalle(this.props.match.params.id)
        .then(data => {
          this.setState({ error: undefined, data: data }, () => {
            setTimeout(() => {
              this.setState({ cardVisible: true });
            }, 300);
          });
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({ id: nextProps.match.params.id }, () => {
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

  //Editar
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

  editar = dataNueva => {
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
      Rules_Entidad.actualizar({
        id: this.state.id,
        nombre: nombre,
        descripcion: descripcion
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Datos de la entidad modificados correctamente" });
          this.setState({ data: { ...this.state.data, nombre: nombre, descripcion: descripcion }, dialogoEditarVisible: false });
        })
        .catch(error => {
          this.setState({ dialogoEditarErrorVisible: true, dialogoEditarError: error, dialogoEditarCargando: false });
        });
    });
  };

  // Foto
  onFilePickerRef = ref => {
    this.filePicker = ref;
  };

  onFile = evt => {
    var files = evt.target.files; // FileList object
    if (files.length != 1) return;

    var file = files[0];
    var fr = new FileReader();

    if (file.size > 10 * 1024 * 1024) {
      this.setState({
        mostrarError: true,
        error: "Tamaño de imagen demasiado grande"
      });
      return;
    }

    let extension = file.name
      .split(".")
      .pop()
      .toLowerCase();
    if (!_.includes(["png", "jpg"], extension)) {
      this.setState({
        errorVisible: true,
        error: "Formato de imagen no soportado"
      });
      return;
    }

    this.setState({ cargando: true }, () => {
      fr.onload = e => {
        this.filePicker.value = "";
        FotoUtils.achicar(e.target.result, 500)
          .then(imagen => {
            Rules_Entidad.setFoto({
              foto: imagen,
              id: this.state.data.id
            })
              .then(() => {
                this.props.mostrarAlertaVerde({ texto: "Imagen de la entidad modificada correctamente" });
                this.buscarDatos();
              })
              .catch(error => {
                this.setState({ errorVisible: true, error: error, cargando: false });
              });
          })
          .catch(error => {
            console.log(error);
            this.setState({ errorVisible: true, error: error, cargando: false });
          });
      };
      fr.readAsDataURL(file);
    });
  };

  onBotonFotoEditarClick = () => {
    this.filePicker.value = "";
    this.filePicker.click();
  };

  // Tramite nuevo

  onBotonTramiteNuevoClick = e => {
    this.mostrarDialogoTramiteNuevo();
  };

  mostrarDialogoTramiteNuevo = () => {
    this.setState({
      ["dialogoTramiteNuevoVisible"]: true,
      ["dialogoTramiteNuevoCargando"]: false,
      ["dialogoTramiteNuevoErrorVisible"]: false
    });
  };

  onDialogoTramiteNuevoClose = () => {
    let cargando = this.state["dialogoTramiteNuevoCargando"];
    if (cargando == true) return;

    this.setState({ ["dialogoTramiteNuevoVisible"]: false });
  };

  crearTramite = data => {
    if (data.nombre == "" || data.descripcion == "") {
      this.setState({
        ["dialogoTramiteNuevoErrorVisible"]: true,
        ["dialogoTramiteNuevoError"]: "Ingrese el nombre y descripción"
      });
      return;
    }
    this.setState(
      {
        ["dialogoTramiteNuevoErrorVisible"]: false,
        ["dialogoTramiteNuevoCargando"]: true
      },
      () => {
        Rules_TramitePorEntidad.insertar({
          idEntidad: this.state.id,
          nombre: data.nombre,
          descripcion: data.descripcion
        })
          .then(() => {
            this.props.mostrarAlertaVerde({ texto: "Trámite creado correctamente" });
            this.buscarDatos();
            this.setState(
              {
                ["dialogoTramiteNuevoCargando"]: false
              },
              () => {
                this.onDialogoTramiteNuevoClose();
              }
            );
          })
          .catch(error => {
            this.setState({
              ["dialogoTramiteNuevoErrorVisible"]: true,
              ["dialogoTramiteNuevoError"]: error,
              ["dialogoTramiteNuevoCargando"]: false
            });
          });
      }
    );
  };

  // Tramite editar
  onBotonTramiteEditarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.props.redireccionar("/Tramite/" + this.state.id + "/" + id);
  };

  //Tramite borrar

  onBotonTramiteBorrarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoTramiteBorrarConfirmacion(id);
  };

  mostrarDialogoTramiteBorrarConfirmacion = id => {
    this.setState({
      dialogoTramiteBorrarConfirmacionId: id,
      dialogoTramiteBorrarConfirmacionVisible: true,
      dialogoTramiteBorrarConfirmacionCargando: false,
      dialogoTramiteBorrarConfirmacionErrorVisible: false
    });
  };

  onDialogoTramiteBorrarConfirmacionClose = () => {
    let cargando = this.state.dialogoTramiteBorrarConfirmacionCargando || false;
    if (cargando == true) return;

    this.setState({ dialogoTramiteBorrarConfirmacionVisible: false });
  };

  onDialogoTramiteBorrarConfirmacionBotonSiClick = () => {};

  // Nuevo link
  onBotonLinkDeInteresNuevoClick = () => {
    this.mostrarDialogoLinkDeInteresNuevo();
  };

  mostrarDialogoLinkDeInteresNuevo = () => {
    this.setState({
      dialogoLinkDeInteresNuevoVisible: true,
      dialogoLinkDeInteresNuevoCargando: false,
      dialogoLinkDeInteresNuevoErrorVisible: false
    });
  };

  onDialogoLinkDeInteresNuevoClose = () => {
    let cargando = this.state.dialogoLinkDeInteresNuevoCargando || false;
    if (cargando == true) return;

    this.setState({ dialogoLinkDeInteresNuevoVisible: false });
  };

  crearLinkDeInteres = data => {
    const { alias, direccion } = data;
    if (alias.trim() == "") {
      this.setState({ dialogoLinkDeInteresNuevoErrorVisible: true, dialogoLinkDeInteresNuevoError: "Ingrese el alias" });
      return;
    }

    if (direccion.trim() == "") {
      this.setState({ dialogoLinkDeInteresNuevoErrorVisible: true, dialogoLinkDeInteresNuevoError: "Ingrese la dirección del enlace" });
      return;
    }

    this.setState({ dialogoLinkDeInteresNuevoErrorVisible: false, dialogoLinkDeInteresNuevoCargando: true }, () => {
      Rules_Entidad.agregarLink({
        id: this.state.id,
        alias: alias,
        url: direccion
      })
        .then(() => {
          this.props.mostrarAlertaVerde({ texto: "Link de interés creado correctamente" });
          this.buscarDatos();
          this.setState({ dialogoLinkDeInteresNuevoVisible: false });
        })
        .catch(error => {
          this.setState({
            dialogoLinkDeInteresNuevoErrorVisible: true,
            dialogoLinkDeInteresNuevoError: error,
            dialogoLinkDeInteresNuevoCargando: false
          });
        });
    });
  };

  //Borrar link
  onBotonLinkDeInteresBorrarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoLinkDeInteresBorrarConfirmar(id);
  };

  mostrarDialogoLinkDeInteresBorrarConfirmar = id => {
    this.setState({
      dialogoLinkDeInteresBorrarConfirmacionVisible: true,
      dialogoLinkDeInteresBorrarConfirmacionCargando: false,
      dialogoLinkDeInteresBorrarConfirmacionErrorVisible: false,
      dialogoLinkDeInteresBorrarConfirmacionId: id
    });
  };

  onDialogoLinkDeInteresBorrarConfirmarClose = () => {
    let cargando = this.state.dialogoLinkDeInteresBorrarConfirmacionCargando || false;
    if (cargando == true) return;
    this.setState({
      dialogoLinkDeInteresBorrarConfirmacionVisible: false
    });
  };

  onDialogoLinkDeInteresBorrarBotonSiClick = () => {
    var id = this.state.dialogoLinkDeInteresBorrarConfirmacionId;
    this.setState(
      {
        dialogoLinkDeInteresBorrarConfirmacionCargando: true,
        dialogoLinkDeInteresBorrarConfirmacionErrorVisible: false
      },
      () => {
        Rules_Entidad.quitarLink({
          id: this.state.id,
          idLink: id
        })
          .then(() => {
            this.props.mostrarAlertaVerde({ texto: "Link de interés borrado correctamente" });
            this.buscarDatos();
            this.setState({ dialogoLinkDeInteresBorrarConfirmacionVisible: false });
          })
          .catch(error => {
            this.setState({
              dialogoLinkDeInteresBorrarConfirmacionCargando: false,
              dialogoLinkDeInteresBorrarConfirmacionErrorVisible: true,
              dialogoLinkDeInteresBorrarConfirmacionError: error
            });
          });
      }
    );
  };

  onTramiteMouseEnter = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ ["tramiteEnfocado" + id]: true });
  };

  onTramiteMouseLeave = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ ["tramiteEnfocado" + id]: false });
  };

  onLinkDeInteresMouseEnter = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ ["linkDeInteresEnfocado" + id]: true });
  };

  onLinkDeInteresMouseLeave = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ ["linkDeInteresEnfocado" + id]: false });
  };

  render() {
    const { classes } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <input style={{ display: "none" }} ref={this.onFilePickerRef} type="file" id="pickerFile" accept="image/*" />

        <_MiPagina cargando={this.state.cargando} onToolbarTituloClick={this.onToolbarTituloClick}>
          <React.Fragment>
            {data != undefined && (
              <React.Fragment>
                <MiBaner
                  visible={this.state.errorVisible}
                  modo="error"
                  mensaje={this.state.error}
                  className={classes.contenedorError}
                  mostrarBoton={true}
                  onBotonClick={this.onErrorClose}
                />

                <MiCard rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
                  <Grid container spacing={16}>
                    {/* Contenido principal */}
                    <Grid item xs={12}>
                      <Grid container direction="row-reverse" spacing={16}>
                        {/* Foto */}
                        <Grid item xs={12} sm={4}>
                          <div className={classes.imagenEntidad} style={{ backgroundImage: "url(" + this.state.data.urlImagen + ")" }} />
                          <Button color="primary" style={{ marginBottom: 16 }} onClick={this.onBotonFotoEditarClick}>
                            <IconEditOutlined style={{ marginRight: 8 }} />
                            Cambiar foto
                          </Button>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          {/* Nombre */}
                          <Typography variant="display1">
                            {data.nombre}

                            <Button color="primary" onClick={this.onBotonEditarClick} style={{ marginLeft: 16 }}>
                              <IconEditOutlined style={{ marginRight: 8 }} />
                              Editar
                            </Button>
                          </Typography>

                          {/* Descripcion */}
                          <Typography variant="body1">{this.state.data.descripcion}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Tramites */}
                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="title">Trámites</Typography>
                        <Button color="primary" onClick={this.onBotonTramiteNuevoClick} style={{ marginLeft: 16 }}>
                          <IconAddOutlined style={{ marginRight: 8 }} />
                          Nuevo
                        </Button>
                      </div>

                      {(data.tramites == undefined || data.tramites.length == 0) && (
                        <Typography variant="body1">No hay trámites registrados</Typography>
                      )}
                      {data.tramites && data.tramites.length != 0 && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {data.tramites.map((tramite, index) => {
                            let enfocado = this.state["tramiteEnfocado" + tramite.id] == true;

                            return (
                              <div
                                key={tramite.id + ""}
                                data-id={tramite.id}
                                onMouseEnter={this.onTramiteMouseEnter}
                                onMouseLeave={this.onTramiteMouseLeave}
                                className={classNames(classes.contenedorTramite, enfocado && "enfocado")}
                              >
                                <Typography variant="body1" key={index} className="texto">
                                  {tramite.nombre}
                                </Typography>
                                <div>
                                  <IconButton
                                    data-id={tramite.id}
                                    className="boton"
                                    style={{ marginLeft: 8 }}
                                    onClick={this.onBotonTramiteEditarClick}
                                  >
                                    <IconEditOutlined />
                                  </IconButton>
                                  <IconButton data-id={tramite.id} className="boton" onClick={this.onBotonTramiteBorrarClick}>
                                    <IconDeleteOutlineOutlined />
                                  </IconButton>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Grid>

                    {/* Links de interes */}
                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="title">Links de interés</Typography>
                        <Button color="primary" onClick={this.onBotonLinkDeInteresNuevoClick} style={{ marginLeft: 16 }}>
                          <IconAddOutlined style={{ marginRight: 8 }} />
                          Nuevo
                        </Button>
                      </div>

                      {/* Sin lins */}
                      {(data.links == undefined || data.links.length == 0) && (
                        <Typography variant="body1">Aún no hay links registrados</Typography>
                      )}
                      {/* Con links */}
                      {data.links &&
                        data.links.length > 0 &&
                        data.links.map((link, index) => {
                          let enfocado = this.state["linkDeInteresEnfocado" + link.id] == true;
                          return (
                            <div
                              key={index}
                              data-id={link.id}
                              onMouseEnter={this.onLinkDeInteresMouseEnter}
                              onMouseLeave={this.onLinkDeInteresMouseLeave}
                              className={classNames(classes.contenedorLinkInteres, enfocado && "enfocado")}
                            >
                              <div className="textos">
                                <Typography variant="body1">{link.alias}</Typography>
                                <Typography variant="body1" target="_blank" href={link.url} component="a" className={classes.linkInteres}>
                                  {link.url}
                                </Typography>
                              </div>
                              <div>
                                <IconButton
                                  data-id={link.id}
                                  className="boton"
                                  style={{ marginLeft: 8 }}
                                  onClick={this.onBotonLinkDeInteresBorrarClick}
                                >
                                  <IconDeleteOutlineOutlined />
                                </IconButton>
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
        </_MiPagina>

        {/* Dialogo editar */}
        {data && (
          <DialogoForm
            titulo="Editar entidad"
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
            onBotonSiClick={this.editar}
            autoCerrarBotonSi={false}
          />
        )}

        {/* Dialogo tramite nuevo */}
        {data && (
          <DialogoForm
            titulo="Nuevo trámite"
            inputs={[
              { key: "nombre", label: "Nombre", value: "" },
              { key: "descripcion", label: "Descripción", multiline: true, value: "" }
            ]}
            cargando={this.state.dialogoTramiteNuevoCargando || false}
            visible={this.state.dialogoTramiteNuevoVisible || false}
            mostrarBaner={this.state.dialogoTramiteNuevoErrorVisible || false}
            textoBaner={this.state.dialogoTramiteNuevoError}
            onClose={this.onDialogoTramiteNuevoClose}
            textoSi="Guardar"
            textoNo="Cancelar"
            onBotonSiClick={this.crearTramite}
            autoCerrarBotonSi={false}
          />
        )}

        {/* Dialogo Tramite Borrar Confirmar */}
        {data && (
          <DialogoMensaje
            visible={this.state.dialogoTramiteBorrarConfirmacionVisible || false}
            onClose={this.onDialogoTramiteBorrarConfirmacionClose}
            cargando={this.state.dialogoTramiteBorrarConfirmacionCargando || false}
            mostrarBaner={this.state.dialogoTramiteBorrarConfirmacionErrorVisible || false}
            textoBaner={this.state.dialogoTramiteBorrarConfirmacionErrorError}
            textoSi={"Borrar"}
            textoNo={"Cancelar"}
            onBotonSiClick={this.onDialogoTramiteBorrarConfirmacionBotonSiClick}
            autoCerrarBotonSi={false}
            mensaje={"¿Esta seguro que desea borrar el trámite seleccionado? Esta acción no se puede deshacer."}
          />
        )}

        {/* Dialogo Link de Interes Nuevo */}
        {data && (
          <DialogoForm
            titulo="Nuevo link de interes"
            inputs={[{ key: "alias", label: "Alias", value: "" }, { key: "direccion", label: "Dirección", value: "" }]}
            cargando={this.state.dialogoLinkDeInteresNuevoCargando || false}
            visible={this.state.dialogoLinkDeInteresNuevoVisible || false}
            mostrarBaner={this.state.dialogoLinkDeInteresNuevoErrorVisible || false}
            textoBaner={this.state.dialogoLinkDeInteresNuevoError}
            onClose={this.onDialogoLinkDeInteresNuevoClose}
            textoSi="Guardar"
            textoNo="Cancelar"
            onBotonSiClick={this.crearLinkDeInteres}
            autoCerrarBotonSi={false}
          />
        )}

        {/* Dialogo Link de Interes Borrar Confirmar */}
        {data && (
          <DialogoMensaje
            visible={this.state.dialogoLinkDeInteresBorrarConfirmacionVisible || false}
            onClose={this.onDialogoLinkDeInteresBorrarConfirmarClose}
            cargando={this.state.dialogoLinkDeInteresBorrarConfirmacionCargando || false}
            mostrarBaner={this.state.dialogoLinkDeInteresBorrarConfirmacionErrorVisible || false}
            textoBaner={this.state.dialogoLinkDeInteresBorrarConfirmacionError}
            textoSi={"Borrar"}
            textoNo={"Cancelar"}
            onBotonSiClick={this.onDialogoLinkDeInteresBorrarBotonSiClick}
            autoCerrarBotonSi={false}
            mensaje={"¿Esta seguro que desea borrar el link de interés seleccionado? Esta acción no se puede deshacer."}
          />
        )}

        {/* Dialogo de tramites editar */}
        {/* {this.state.data &&
          this.state.data.tramites.map(tramite => {
            return (
              <DialogoTramite
                key={"" + tramite.id}
                visible={this.state["dialogoTramiteEditarVisible" + tramite.id] || false}
                data={tramite}
                onBotonSiClick={this.editarTramite}
                onClose={this.onDialogoTramiteEditarClose}
                mostrarBaner={this.state["dialogoTramiteEditarErrorVisible" + tramite.id] || false}
                textoBaner={this.state["dialogoTramiteEditarError" + tramite.id] || ""}
                cargando={this.state["dialogoTramiteEditarCargando" + tramite.id] || false}
              />
            );
          })} */}

        {/* Dialogo mensaje */}
        {/* <DialogoMensaje
          onClose={this.onDialogoMensajeClose}
          textoSi={"Aceptar"}
          botonNoVisible={false}
          visible={this.state.dialogoMensajeVisible || false}
          mensaje={this.state.dialogoMensajeContenido}
        /> */}
      </React.Fragment>
    );
  }
}

// class DialogoTramite extends React.PureComponent {
//   onClose = () => {
//     this.props.onClose && this.props.onClose(this.props.data);
//   };

//   onBotonSiClick = dataNueva => {
//     this.props.onBotonSiClick && this.props.onBotonSiClick(this.props.data, dataNueva);
//   };

//   render() {
//     const { data, cargando, visible, mostrarBaner, textoBaner } = this.props;

//     return (
//       <DialogoForm
//         titulo="Nuevo trámite"
//         inputs={[
//           { key: "nombre", label: "Nombre", value: data.nombre },
//           { key: "descripcion", label: "Descripción", multiline: true, value: data.descripcion }
//         ]}
//         cargando={cargando}
//         visible={visible}
//         mostrarBaner={mostrarBaner}
//         textoBaner={textoBaner}
//         onClose={this.onClose}
//         textoSi="Guardar"
//         textoNo="Cancelar"
//         onBotonSiClick={this.onBotonSiClick}
//         autoCerrarBotonSi={false}
//       />
//     );
//   }
// }

let componente = EntidadDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
