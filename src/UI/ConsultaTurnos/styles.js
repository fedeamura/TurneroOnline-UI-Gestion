import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";

const styles = theme => {
  return {
    contenedorInfoTurnero: {
      display: "flex",
      alignItems: "flex-start",
      opacity: 0,
      transition: "all 0.3s",
      marginBottom: "16px",
      "& .imagen": {
        backgroundSize: "cover",
        backgroundPosition: "center"
        // borderRadius: theme.spacing.unit
      },
      "&.visible": {
        opacity: 1
      },
      "& .textos": {
        flex: 1,
        fontSize: 10
      }
    },
    imagenTurnero: {
      marginRight: theme.spacing.unit * 2
    },
    contenedorCalendario: {
      opacity: 0,
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1
      }
    },
    calendario: {
      height: "350px"
    },
    calendarioEncabezado: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.025)",
      padding: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      marginBottom: theme.spacing.unit * 2,
      "& .titulo": {
        flex: 1
      }
    },
    contenedorError: {
      backgroundColor: red["500"],
      borderRadius: "16px",
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      marginBottom: "16px !important"
    },
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      pointerEvents: "none",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    contenedorBotones: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end"
    },
    contenedorTitulo: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing.unit * 2,
      [theme.breakpoints.up("lg")]: {
        flexDirection: "row"
      },
      "& .titulo": {
        flex: 1
      },
      "& .filtros": {
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: theme.spacing.unit * 2,
        [theme.breakpoints.up("lg")]: {
          marginTop: 0
        },
        display: "flex"
      }
    },
    contenedorTituloFiltros: {
      padding: theme.spacing.unit * 2,
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      "& .titulo": {
        flex: 1
      }
    },
    contenedorTabla: {
      backgroundColor: "rgba(0,0,0,0.05)",
      display: "flex",
      "& > .main": {
        flex: 1,
        overflow: "auto",
        backgroundColor: "white",
        boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
      }
    },
    tabla: {
      flex: 1
    },
    contenedorFiltros: {
      width: "100%",
      overflow: "hidden",
      padding: "0",
      maxWidth: 0,
      opacity: 0,
      transition: "opacity 0.3s, max-width 0.3s 0.3s, padding 0.3s 0.3s",
      "&.visible": {
        opacity: 1,
        maxWidth: "10rem",
        transition: "opacity 0.3s 0.3s, max-width 0.3s, padding 0.3s"
      },
      "& .content": {
        padding: "16px"
      }
    },
    contenedorHide: {
      opacity: 0,
      pointerEvents: "none",
      maxWidth: "0rem",
      minWidth: 0,
      overflow: "hidden",
      transition: "opacity 0.3s, max-width 0.3s 0.3s, padding 0.3s 0.3s",
      "&.visible": {
        opacity: 1,
        maxWidth: "10rem",
        transition: "opacity 0.3s 0.3s, max-width 0.3s, padding 0.3s",
        pointerEvents: "auto"
      }
    },
    botonFiltro: {},
    botonBusquedaPorUsuario: {
      marginRight: "16px",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    cardCalendario: {
      height: "400px",
      "& > div": {
        height: "100%"
      },
      opacity: 0.4,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    colEstado: {
      display: "flex",
      alignItems: "center",
      "& > div": {
        marginRight: "8px"
      }
    },
    indicadorEstado: {
      width: 20,
      height: 20,
      backgroundColor: "black",
      borderRadius: 20
    },
    contenedorIndicadorDiaCalendario: {
      display: "flex",
      position: "absolute",
      bottom: "0px"
    },
    indicadorDiaCalendario: {
      width: 8,
      height: 8,
      backgroundColor: "black",
      borderRadius: 8,
      border: "1px solid white",
      "&:not(:last-child)": {
        marginRight: "2px"
      }
    },
    contenedorFiltroEstado: {
      display: "flex"
    },
    contenedorHelpBotones: {
      display: "flex",
      padding: "16px",
      flexWrap: "wrap"
    },
    helpBotonTabla: {
      padding: "4px",
      display: "flex",
      alignItems: "center",
      "& > .material-icons": {
        opacity: 0.5,
        marginRight: "4px"
      },
      marginRight: "16px"
    },
    cardInfoBusquedaPorUsuario: {
      marginTop: "16px",
      backgroundColor: yellow["100"],
      "& > div": {
        display: "flex"
      },
      "& .material-icons": {
        marginRight: "8px"
      }
    },
    cardFiltrosActivos: {
      marginTop: "16px"
    },
    linkInteres: {
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
