import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { breakpoints } from "../../theme/constant";
import useStyles from "./styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import AlertDialog from "./AlertDialog";
import { Box } from "@mui/system";
import { format } from "../../common/date";
export default function CheckMoreBatches(props) {
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const classes = useStyles();
  const {
    open,
    handleUpcomingBatchesClickOpen,
    handleUpcomingBatchesClickClose,
  } = props;

  const { upcomingBatchesData } = props;
  const user = useSelector(({ User }) => User);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [AlertData, setAlertData] = React.useState({});
  const handelEnrollment = () => {
    setOpenDialog(true);
  };

  const close = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Dialog open={open} onClose={handleUpcomingBatchesClickClose}>
        <div className={classes.MoreBatchWrap}>
          <Typography variant="h5" align="start">
            More Batches
          </Typography>
          {upcomingBatchesData?.slice(1, 3).map((item) => (
            <Box className={classes.MoreBatchCard}>
              {" "}
              <Typography variant="h6" mt={2}>
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                mt={1}
                style={{
                  display: "flex",
                  padding: "10px 0",
                }}
              >
                <img
                  className={classes.icons}
                  src={require("./assets/calender.svg")}
                  alt="Students Img"
                />
                {format(item.start_time, "dd MMM yy")} -{" "}
                {format(item.end_time, "dd MMM yy")}
              </Typography>
              <Button
                fullWidth
                onClick={() => {
                  handelEnrollment(item.id);
                  setAlertData({
                    title: item.title,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    id: item.id,
                  });
                }}
                variant="contained"
              >
                Enroll Batch
              </Button>
            </Box>
          ))}
          <AlertDialog
            open={openDialog}
            close={close}
            title={AlertData?.title}
            start_time={AlertData?.start_time}
            end_time={AlertData?.end_time}
            id={AlertData?.id}
            registerAll={true}
            type="batch"
          />
        </div>
      </Dialog>
    </>
  );
}
