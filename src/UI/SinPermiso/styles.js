const styles = theme => {
  return {
    content: {
      overflow: "auto",
      flex: 1
    },
    titulo:{
      marginTop:'32px',
      marginLeft:'16px',
      marginBottom:'32px',
    },
    card: {
      "&:not(:last-child)": {
        marginBottom: "16px"
      }
    },
    contenedorTextos: {
      padding: "16px"
    },
    contenedorBotones: {
      padding: "16px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end"
    }
  };
};

export default styles;
