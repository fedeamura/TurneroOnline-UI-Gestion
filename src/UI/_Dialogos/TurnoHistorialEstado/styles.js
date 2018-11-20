import red from "@material-ui/core/colors/red";

const styles = theme => {
  return {
    primeraLineaEncabezado: {
      display: "flex",
      alignItems: "end"
    },
    contenedorCodigo: {
      flex: 1,
      marginBottom: "16px"
    },
    contenedorIndicadorCargando: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    },
    contenedorEncabezado: {
      padding: "24px",
      minWidth: "400px",
      backgroundColor: "rgba(0,0,0,0.05)"
    },
    contenedorEstado: {
      display: "flex",
      alignItems: "center"
    },
    indicadorEstado: {
      height: "20px",
      width: "20px",
      marginRight: "8px",
      borderRadius: "20px"
    },
    conenedorTexto: {
      display: "flex",
      alignItems: "center",
      "& *:first-child": {
        marginRight: "4px"
      }
    },
    contenedorBotones: {
      marginTop: "16px",
      "& > button": {
        margin: "4px",
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: "4px",
        paddingRight: "8px",
        "& span": {
          fontSize: "12px"
        },
        "& svg": {
          marginRight: "4px"
        }
      }
    },
    contenedorBody: {
      padding: "24px"
    },
    contenedorError: {
      backgroundColor: red["500"],
      marginBottom: "0px !important",
      "& *": {
        fontColor: "white !important",
        color: "white !important"
      }
    }
  };
};

export default styles;
