const styles = theme => {
  return {
    indicadorCargando: {
      position: "absolute",
      left: "4px",
      top: "4px",
      width: "calc(100% - 8px)",
      height: "calc(100% - 8px)"
    },
    textoSubtitulo: {
      marginLeft: "24px",
      marginTop: "16px"
    },
    contenedorEmpty: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "24px"
    },
    botonNuevoUsuario: {
      marginTop: "16px"
    },
    iconoEmpty: {
      fontSize: "48px",
      opacity: 0.7
    }
  };
};

export default styles;
