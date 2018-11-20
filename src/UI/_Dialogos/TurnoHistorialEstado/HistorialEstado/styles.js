import red from "@material-ui/core/colors/red";

const styles = theme => {
  return {
    contenedor: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      paddingBottom: "32px"
    },
    indicadorEstado: {
      zIndex: 2,
      alignSelf: "baseline",
      marginTop: "6px",
      minWidth: "20px",
      minHeight: "20px",
      height: "20px",
      width: "20px",
      marginRight: "8px",
      borderRadius: "20px",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
    },
    lineaArriba: {
      position: "absolute",
      width: "4px",
      backgroundColor: "rgba(0,0,0,0.05)",
      top: 0,
      left: 8,
      height: 20
    },
    lineaAbajo: {
      position: "absolute",
      width: "4px",
      backgroundColor: "rgba(0,0,0,0.05)",
      top: 20,
      left: 8,
      bottom: 0
    },
    linea1: {
      display: "flex",
      alignItems: "center",
      marginBottom:'8px'
    },
    textoNombreEstado: {
      marginRight: "4px"
    },
    contenedorUsuarioAsociado: {
      display: "flex",
      alignItems: "center"
    },
    fotoUsuarioAsociado: {
      width: "20px",
      height: "20px",
      backgroundColor: "rgba(0,0,0,0.1)",
      backgroundSize: "cover",
      borderRadius: "20px",
      marginLeft: "8px",
      marginRight: "8px",
      alignSelf: "end"
    },
    contenedorPor: {
      display: "flex",
      alignItems: "center"
    },
    info: {
      "&:not(:last-child)": {
        marginBottom: "4px"
      }
    },
    textoPor: {
      marginRight: "4px",
      minWidth: "90px",
      maxWidth: "90px"
    },
    textoEl: {
      marginLeft: "4px",
      marginRight: "4px"
    },
    link: {
      textDecoration: "underline",
      cursor: "pointer",
      "&:hover": {
        fontWeight: "bold"
      }
    }
  };
};

export default styles;
