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
  FormControl,
  Grid
} from "@material-ui/core";
import IconSearchOutlined from "@material-ui/icons/SearchOutlined";
import IconPersonOutlined from "@material-ui/icons/PersonOutlined";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

import CordobaFilesUtils from "@Componentes/Utils/CordobaFiles";

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

class DialogoUsuarioDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      cargando: false,
      errorMensaje: "",
      errorVisible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ data: undefined, cargando: false, mostrarError: false }, () => {
        this.buscarDatos();
      });
    }
  }

  buscarDatos() {
    this.setState({ cargando: true, errorVisible: false }, () => {
      Rules_Usuario.getDetalle(this.props.id)
        .then(data => {
          this.setState({ data: data });
        })
        .catch(error => {
          this.setState({ errorVisible: true, errorMensaje: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  render() {
    const { classes, fullScreen } = this.props;
    const { data } = this.state;

    var urlFoto = "";
    var nombre = "";
    var dni = "";
    var sexo = "";
    var cuil = "";
    var email = "";
    var telefonoFijo = "";
    var telefonoCelular = "";

    if (data) {
      urlFoto = CordobaFilesUtils.getUrlFotoMediana(data.identificadorFotoPersonal, data.sexoMasculino);
      nombre = `${data.nombre} ${data.apellido}`;
      dni = data.dni || "Sin datos";
      sexo = data.sexoMasculino || true ? "Masculino" : "Femenino";
      cuil = data.cuil || "Sin datos";
      email = data.email || "Sin datos";
      telefonoFijo = data.telefonoFijo || "Sin datos";
      telefonoCelular = data.telefonoCelular || "Sin datos";
    }

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.visible}
        onClose={this.onClose}
        aria-labelledby="dialogo"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {/* <DialogTitle>Detalle de usuario</DialogTitle> */}
        <DialogContent style={{ padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "rgba(0,0,0,0.05)", padding: 24 }}>
            <Avatar src={urlFoto} style={{ width: 72, height: 72, marginRight: 12 }} />
            <Typography variant="title">{nombre}</Typography>
          </div>
          <div style={{ padding: 24 }}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>DNI: </b>
                  {dni}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>CUIL: </b>
                  {cuil}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>Sexo: </b>
                  {sexo}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>E-Mail: </b>
                  {email}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>Teléfono fijo: </b>
                  {telefonoFijo}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <b>Teléfono celular: </b>
                  {telefonoCelular}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>

        <div className={classNames(classes.cargando, this.state.cargando == true && "visible")}>
          <CircularProgress />
        </div>
      </Dialog>
    );
  }
}

let componente = DialogoUsuarioDetalle;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
