import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { mostrarAlerta, mostrarAlertaNaranja } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";
import {
  Typography,
  Button,
  CircularProgress,
  ListItem,
  Avatar,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
  Input,
  InputLabel,
  FormControl
} from "@material-ui/core";
import IconSearchOutlined from "@material-ui/icons/SearchOutlined";
import IconPersonOutlined from "@material-ui/icons/PersonOutlined";

//Mis componentes
import UsuarioDetalle from "@Componentes/MiUsuarioDetalle";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    rol: state.Usuario.rol
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarAlerta: comando => {
    dispatch(mostrarAlerta(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  }
});

class DialogoSelectorUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buscoAlgunaVez: false,
      input: "",
      cargando: false,
      data: [],
      error: undefined,
      mostrarError: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ input: "", data: [], mostrarError: false, buscoAlgunaVez: false });
    }
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onChange = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onKeyPress = ev => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      this.buscar();
    }
  };

  buscar = () => {
    let { input } = this.state;
    if (input.length < 3) {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese al menos 3 caracteres" });
      return;
    }

    this.setState({ cargando: true }, () => {
      Rules_Usuario.buscar({
        idEntidad: this.props.rol.entidadId,
        consulta: input
      })
        .then(data => {
          this.setState({ buscoAlgunaVez: true, data: data });
        })
        .catch(error => {
          this.props.mostrarAlertaNaranja({ texto: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onUsuarioClick = usuario => {
    this.props.onUsuarioSeleccionado && this.props.onUsuarioSeleccionado(usuario);
  };

  render() {
    const { classes, fullScreen } = this.props;

    let usuariosValidados = _.filter(this.state.data, item => {
      return item.validacionRenaper == true;
    });

    let usuariosNoValidados = _.filter(this.state.data, item => {
      return item.validacionRenaper != true;
    });

    return (
      <React.Fragment>
        <Dialog fullScreen={fullScreen} open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">Buscar usuario</DialogTitle>
          <DialogContent style={{ padding: 0 }}>
            <div style={{ padding: 24, paddingTop: 0 }}>
              <FormControl className={classes.margin} disabled={this.state.cargando}>
                <InputLabel htmlFor="inputBuscar">Buscar</InputLabel>
                <Input
                  autoFocus
                  id="inputBuscar"
                  value={this.state.input}
                  name="input"
                  onChange={this.onChange}
                  placeholder="N° de Documento o CUIL"
                  onKeyPress={this.onKeyPress}
                />
              </FormControl>
              <Button
                disabled={this.state.cargando}
                onClick={this.buscar}
                variant="fab"
                color="primary"
                style={{
                  width: "48px",
                  height: "48px",
                  marginLeft: "16px"
                }}
              >
                {this.state.cargando == false && <IconSearchOutlined />}
                {this.state.cargando == true && <CircularProgress className={classNames(classes.indicadorCargando)} />}
              </Button>
            </div>

            {this.state.data.length == 0 &&
              this.state.buscoAlgunaVez == true && (
                <div className={classes.contenedorEmpty}>
                  <IconPersonOutlined className={classes.iconoEmpty}/>
                  <Typography variant="body1">No existe el usuario indicado.</Typography>
                  <Button className={classes.botonNuevoUsuario} variant="outlined" color="primary">
                    Crear usuario
                  </Button>
                </div>
              )}

            {usuariosNoValidados.length != 0 && (
              <Typography className={classes.textoSubtitulo} variant="body2">
                Usuarios validados en renaper
              </Typography>
            )}

            {usuariosValidados.map((item, index) => {
              return <ItemUsuario key={index} data={item} onClick={this.onUsuarioClick} />;
            })}

            {usuariosNoValidados.length != 0 && (
              <Typography variant="body2" className={classes.textoSubtitulo}>
                Usuarios no validados en renaper
              </Typography>
            )}
            {usuariosNoValidados.map((item, index) => {
              return <ItemUsuario key={index} data={item} onClick={this.onUsuarioClick} />;
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClose} color="primary">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

class ItemUsuario extends React.PureComponent {
  onClick = () => {
    this.props.onClick && this.props.onClick(this.props.data);
  };

  render() {
    return (
      <ListItem dense button onClick={this.onClick}>
        <UsuarioDetalle data={this.props.data} />
      </ListItem>
    );
  }
}
let componente = DialogoSelectorUsuario;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
