import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

import { IconButton, Tooltip } from "@material-ui/core";
import IconOpenInBrowserOutlined from "@material-ui/icons/OpenInBrowserOutlined";
import IconAssignmentLateOutlined from "@material-ui/icons/AssignmentLateOutlined";
import IconAssignmentIndOutlined from "@material-ui/icons/AssignmentIndOutlined";
import IconCancelOutlined from "@material-ui/icons/CancelOutlined";
import IconCheckCircleOutlined from "@material-ui/icons/CheckCircleOutlined";

const ESTADO_VENCIDO_KEY_VALUE = -1;
const ESTADO_DISPONIBLE_KEY_VALUE = 1;
const ESTADO_RESERVADO_KEY_VALUE = 2;
const ESTADO_COMPLETADO_KEY_VALUE = 3;
const ESTADO_CANCELADO_KEY_VALUE = 4;

class BotonesTabla extends React.PureComponent {
  onBotonDetalleClick = () => {
    this.props.onBotonDetalleClick && this.props.onBotonDetalleClick(this.props.data);
  };

  onBotonAsignarUsuarioClick = () => {
    this.props.onBotonAsignarUsuarioClick && this.props.onBotonAsignarUsuarioClick(this.props.data);
  };

  onBotonCancelarReservaClick = () => {
    this.props.onBotonCancelarReservaClick && this.props.onBotonCancelarReservaClick(this.props.data);
  };

  onBotonCancelarClick = () => {
    this.props.onBotonCancelarClick && this.props.onBotonCancelarClick(this.props.data);
  };

  onBotonCompletarClick = () => {
    this.props.onBotonCompletarClick && this.props.onBotonCompletarClick(this.props.data);
  };

  render() {
    let { classes, data } = this.props;

    return (
      <div className={classes.contenedor}>
        {/* Abrir */}
        <Tooltip title="Abrir detalle">
          <IconButton onClick={this.onBotonDetalleClick}>
            <IconOpenInBrowserOutlined />
          </IconButton>
        </Tooltip>

        {/* Cancelar reserva */}
        {(this.props.botonCancelarReservaVisible === undefined || this.props.botonCancelarReservaVisible !== false) &&
          ([ESTADO_RESERVADO_KEY_VALUE].indexOf(data.estadoKeyValue) != -1 && (
            <Tooltip title="Cancelar reserva">
              <IconButton onClick={this.onBotonCancelarReservaClick}>
                <IconAssignmentLateOutlined />
              </IconButton>
            </Tooltip>
          ))}

        {/* Asignar turno */}
        {(this.props.botonAsigarUsuarioVisible === undefined || this.props.botonAsigarUsuarioVisible !== false) &&
          ([ESTADO_DISPONIBLE_KEY_VALUE].indexOf(data.estadoKeyValue) != -1 && (
            <Tooltip title="Asignar turno">
              <IconButton onClick={this.onBotonAsignarUsuarioClick}>
                <IconAssignmentIndOutlined />
              </IconButton>
            </Tooltip>
          ))}

        {/* Cancelar turno */}
        {(this.props.botonCancelarVisible === undefined || this.props.botonCancelarVisible !== false) &&
          ([ESTADO_DISPONIBLE_KEY_VALUE, ESTADO_RESERVADO_KEY_VALUE].indexOf(data.estadoKeyValue) != -1 && (
            <Tooltip title="Cancelar turno">
              <IconButton onClick={this.onBotonCancelarClick}>
                <IconCancelOutlined />
              </IconButton>
            </Tooltip>
          ))}

        {/* Completar turno */}
        {(this.props.botonCompletarVisible === undefined || this.props.botonCompletarVisible !== false) &&
          ([ESTADO_RESERVADO_KEY_VALUE].indexOf(data.estadoKeyValue) != -1 && (
            <Tooltip title="Completar turno">
              <IconButton onClick={this.onBotonCompletarClick}>
                <IconCheckCircleOutlined />
              </IconButton>
            </Tooltip>
          ))}
      </div>
    );
  }
}

let componente = BotonesTabla;
componente = withStyles(styles)(componente);
export default componente;
