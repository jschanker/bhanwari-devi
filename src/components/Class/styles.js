import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "340px",
    display: "flex",
    maxWidth: "380px",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "0px 4px 0px 4px",
    padding: "15px",
    "&:hover": {
      boxShadow:
        "0px 16px 24px rgba(0, 0, 0, 0.06), 0px 6px 30px rgba(0, 0, 0, 0.04), 0px 8px 10px rgba(0, 0, 0, 0.08)",
    },
  },
  spacing: {
    padding: "12px 0",
  },
  Buttons: {
    width: "90%",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonGroup2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
  },
  icons: {
    marginRight: "15px",
    // position: "flex-start",
  },
}));

export default useStyles;
