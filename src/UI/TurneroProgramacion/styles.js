const styles = theme => {
  return {
    content: {
      padding: 0,
      height: "100%",
      overflow: "hidden",
      "& > div": {
        height: "100%",
        overflow: "hidden",
        "& > div": {
          height: "100%",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column"
        }
      }
    },
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      flex: 1,
      overflow: "hidden",
      padding: "16px",
      "& > div": {
        height: "100%",
        "& > div": {
          height: "100%",
          "& > div": {
            height: "100%"
          }
        }
      },
      "&.visible": {
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    contenedorBotones: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "",
      paddingTop: theme.spacing.unit * 2,
      "& .boton": {
        marginBottom: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2
      }
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
    contenedorError: {
      borderRadius: "16px",
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      marginBottom: "16px !important"
    },
    horarioSemanal: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      padding: theme.spacing.unit,
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
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
      }
    },
    contenedorExcepciones: {},
    excepcion: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      padding: theme.spacing.unit,
      "& .horario": {
        display: "flex",
        backgroundColor: "white",
        marginBottom: theme.spacing.unit,
        borderRadius: theme.spacing.unit,
        padding: theme.spacing.unit,
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.025)",
          "& .boton": {
            opacity: 1,
            pointerEvents: "auto"
          }
        }
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& .contenedorBotones .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
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
      }
    },
    lightTooltip: {
      // backgroundColor: theme.palette.common.white,
      // color: 'rgba(0, 0, 0, 0.87)',
      // boxShadow: theme.shadows[1],
      fontSize: 14
    },
    contenedorEncabezado: {
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "16px",
      minHeight: "fit-content",
      opacity: 0,
      transition: "all 0.3s",
      display: "flex",
      alignItems: "flex-start",
      "&.visible": {
        opacity: 1
      }
    },
    contenedorInfoContextual: {
      display: "flex",
      alignItems: "flex-start",
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
