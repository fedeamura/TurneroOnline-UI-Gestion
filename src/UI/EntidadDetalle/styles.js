const styles = theme => {
  return {
    contentClassName: {
      transition: "all 0.3s",
      "&.drawerVisible": {
        [theme.breakpoints.up("md")]: {
          paddingLeft: "300px"
        }
      }
    },
    drawer: {
      backgroundColor: "white",
      border: "none",
      width: "300px",
      [theme.breakpoints.up("md")]: {
        paddingTop: "70px",
        backgroundColor: "transparent",
        "& .item": {
          borderTopRightRadius: "32px",
          borderBottomRightRadius: "32px"
        }
      }
    },
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    imagenEntidad: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "16px",
      width: "100%",
      height: "200px",
      marginBottom: "16px"
    },
    contenedorLinksInteres: {
      marginTop: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
    linkInteres: {
      cursor: "pointer",
      textDecoration: "underline",
      color: theme.palette.primary.main,
      "&:hover": {
        fontWeight: "bold"
      }
    },
    contenedorTramite: {
      marginTop: "16px",
      marginBottom: "32px"
    },
    contenedorBotonesTramite: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "16px",
      "& button:not(:last-child)": {
        marginRight: "8px"
      }
    },
    contenedorError: {
      borderRadius: "16px",
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      marginBottom: "16px !important"
    },
    contenedorTramite: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: 8,
      paddingLeft: 8,
      "& .texto": {
        flex: 1
      },
      "& .boton": {
        opacity: 0,
        pointerEvents: "none",
        // transform: "scale(0.7)",
        transition: "all 0.3s"
      },
      "&.enfocado": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
      }
    },
    contenedorLinkInteres: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: 8,
      paddingLeft: 8,
      "& .textos": {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline"
      },
      "& .boton": {
        opacity: 0,
        pointerEvents: "none",
        // transform: "scale(0.7)",
        transition: "all 0.3s"
      },
      "&.enfocado": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
      }
    }
  };
};

export default styles;
