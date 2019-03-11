import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { Typography, Icon } from "@material-ui/core";
import IconKeyboardArrowRightOutlined from "@material-ui/icons/KeyboardArrowRightOutlined";

//Mis Componentes
import CordobaFileUtils from "@Componentes/Utils/CordobaFiles";
import DateUtils from "@Componentes/Utils/Date";

import DialogoUsuarioDetalle from "../../../_Dialogos/UsuarioDetalle";

class HistorialEstado extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogoUsuarioDetalleVisible: false,
      dialogoUsuarioDetalleId: -1
    };
  }

  componentDidMount() {}

  onUsuarioModificacionClick = () => {
    this.setState({ dialogoUsuarioDetalleVisible: true, dialogoUsuarioDetalleId: this.props.data.usuarioCreadorId });
  };

  onUsuarioAsociadoClick = () => {
    this.setState({ dialogoUsuarioDetalleVisible: true, dialogoUsuarioDetalleId: this.props.data.usuarioAsociadoId });
  };

  onDialogoUsuarioDetalleClose = () => {
    this.setState({ dialogoUsuarioDetalleVisible: false });
  };

  render() {
    const { classes, data } = this.props;
    if (data == undefined) return null;

    let {
      color,
      nombre,
      fecha,
      usuarioAsociadoId,
      usuarioAsociadoNombre,
      usuarioAsociadoApellido,
      usuarioAsociadoIdentificadorFotoPersonal,
      usuarioAsociadoSexoMasculino,

      usuarioCreadorNombre,
      usuarioCreadorApellido,
      usuarioCreadorIdentificadorFotoPersonal,
      usuarioCreadorSexoMasculino,
      motivo
    } = data;

    if (fecha) {
      fecha = DateUtils.toDateTime(fecha);
      fecha = DateUtils.toDateTimeString(fecha);
    }

    let fotoUsuarioAsociado = CordobaFileUtils.getUrlFotoMiniatura(usuarioAsociadoIdentificadorFotoPersonal, usuarioAsociadoSexoMasculino);
    let fotoUsuarioCreador = CordobaFileUtils.getUrlFotoMiniatura(usuarioCreadorIdentificadorFotoPersonal, usuarioCreadorSexoMasculino);

    return (
      <React.Fragment>
        <div className={classes.contenedor}>
          {/* Lineas arriba y abajo */}
          {this.props.primero != true && <div className={classes.lineaArriba} />}
          {this.props.ultimo != true && <div className={classes.lineaAbajo} />}

          <div className={classes.indicadorEstado} style={{ backgroundColor: color }} />
          <div className={classes.textos}>
            <div className={classes.linea1}>
              <Typography variant="body2" className={classes.textoNombreEstado} noWrap>
                {nombre}
              </Typography>
              <Typography variant="caption" noWrap>
                {fecha || "Sin fecha"}
              </Typography>
            </div>
            {motivo && <Typography variant="body1">Motivo: {motivo}</Typography>}

            {usuarioAsociadoId && (
              <div className={classNames(classes.contenedorUsuarioAsociado, classes.info)}>
                <Typography variant="body1" className={classes.textoPor} noWrap>
                  Asociado a
                </Typography>
                <div className={classes.fotoUsuarioAsociado} style={{ backgroundImage: `url(${fotoUsuarioAsociado})` }} />
                <Typography variant="body1" className={classes.link} noWrap onClick={this.onUsuarioAsociadoClick}>
                  {usuarioAsociadoNombre + " " + usuarioAsociadoApellido}
                </Typography>
              </div>
            )}

            <div className={classNames(classes.contenedorPor, classes.info)}>
              <Typography variant="caption" className={classes.textoPor} noWrap>
                Modificado por
              </Typography>
              <div className={classes.fotoUsuarioAsociado} style={{ backgroundImage: `url(${fotoUsuarioCreador})` }} />
              <Typography variant="caption" className={classes.link} noWrap onClick={this.onUsuarioModificacionClick}>
                {usuarioCreadorNombre} {usuarioCreadorApellido}
              </Typography>
            </div>

            {/* {this.props.data.usuarioAsociadoId && (
              // <Typography variant="body1">
              //   Usuario asociado: {usuarioAsociadoNombre} {usuarioAsociadoApellido}
              // </Typography>
            )} */}
          </div>
        </div>

        {/* Detalle usuario */}
        <DialogoUsuarioDetalle
          visible={this.state.dialogoUsuarioDetalleVisible}
          id={this.state.dialogoUsuarioDetalleId || -1}
          onClose={this.onDialogoUsuarioDetalleClose}
        />
      </React.Fragment>
    );
  }
}

let componente = HistorialEstado;
componente = withStyles(styles)(componente);
export default componente;
