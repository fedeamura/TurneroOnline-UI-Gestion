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

    link: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: 8,
      paddingLeft: 8,
      marginBottom: 4,
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
    requisito: {
      display: "flex",
      flexDirection: "row",
      alignItems: "start",
      backgroundColor: "transparent",
      borderRadius: 8,
      paddingLeft: 8,
      marginBottom: 4,
      "& > .textos": {
        flex: 1
      },
      "& > .botones": {
        display: "flex",
        alignSelf: "flex-start",
        "& > .boton": {
          opacity: 0,
          pointerEvents: "none",
          transition: "all 0.3s"
        }
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.025)",
        "& > .botones > .boton": {
          opacity: 1,
          pointerEvents: "auto"
        }
      },
      "& .link": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 4,
        "& > .botones": {
          display: "flex",
          alignSelf: "flex-start",
          "& > .boton": {
            width: 30,
            height: 30,
            padding: 0,
            opacity: 0,
            pointerEvents: "none",
            transition: "all 0.3s"
          }
        },
        "& .textos": {
          flex: 1,
          "& .texto": {
            textDecoration: "underline",
            color: theme.palette.primary.main,
            cursor: "pointer"
          }
        },
        "&:hover": {
          "& > .botones > .boton": {
            opacity: 1,
            pointerEvents: "auto"
          }
        }
      }
    },
    ubicacion: {
      display: "flex",
      "& .mapa": {
        borderRadius: 8,
        minWidth: 104,
        maxWidth: 104,
        maxHeight: 104,
        minHeight: 104,
        backgroundColor: "red",
        marginRight: 16,
        backgroundSize: "contain"
      },
      "& .textos": {
        flex: 1
      }
    },
    usuario: {
      display: "flex",
      "& .contenedorInfo": {
        flex: 1
      },
      "& .botones": {
        transition: "all 0.3s",
        pointerEvents: "none",
        opacity: 0
      },
      "&:hover": {
        "& .botones": {
          pointerEvents: "all",
          opacity: 1
        }
      }
    }
  };
};

export default styles;
