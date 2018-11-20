const styles = theme => {
  return {
    titulo: {
      marginLeft: "16px"
    },
    card: {
      "&:not(:last-child)": {
        marginBottom: "16px"
      }
    },
    imagenEntidad: {
      margin: "16px",
      marginRight: "0px",
      borderRadius: "16px",
      backgroundSize: "cover",
      width: "156px",
      height: "156px"
    },
    cardContent: {
      display: "flex"
    },
    contenedorTextos: {
      padding: "16px"
    },
    contenedorBotones: {
      padding: "16px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end"
    },
    link: {
      cursor: "pointer",
      textDecoration: "underline",
      color: theme.palette.primary.main,
      "&:hover": {
        fontWeight: "bold"
      }
    }
  };
};

export default styles;
