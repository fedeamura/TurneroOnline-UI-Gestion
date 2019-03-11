const styles = theme => {
  return {
    cargando: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    }
  };
};

export default styles;
