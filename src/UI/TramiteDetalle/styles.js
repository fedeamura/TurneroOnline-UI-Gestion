const styles = theme => {
  return {
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    contenedorError: {
      borderRadius: "16px",
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      marginBottom: "16px !important"
    },
    contenedorTurnero: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: 8,
      paddingLeft: 8,
      marginBottom: 4,
      "&.borrador": {
        border: "1px dotted rgba(0,0,0,0.4)"
      },
      "& .textos": {
        flex: 1
      },
      "& .contenedorBotones": {
        display: "flex",
        alignSelf: "flex-start"
      },
      "& .boton": {
        opacity: 0,
        pointerEvents: "none",
        // transform: "scale(0.7)",
        transition: "all 0.3s"
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
      }
    },
    contenedorInfoContextual: {
      display: "flex",
      alignItems: "flex-start",
      opacity: 0,
      transition: "all 0.3s",
      marginBottom: "16px",
      "& .imagen": {
        width: 56,
        height: 56,
        borderRadius: theme.spacing.unit,
        boxShadow: theme.shadows[2],
        backgroundSize: "cover",
        backgroundPosition: "center"
        // borderRadius: theme.spacing.unit
      },
      "&.visible": {
        opacity: 1
      },
      "& .textos": {
        marginTop: "2px",
        marginLeft: theme.spacing.unit,
        flex: 1,
        fontSize: 10
      },
      "& .boton": {
        marginTop: "4px",
        minHeight: "16px",
        padding: "4px 8px"
      }
    }
  };
};

export default styles;
