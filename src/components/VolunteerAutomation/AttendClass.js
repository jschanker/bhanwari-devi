import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { actions as classActions } from "../../components/Class/redux/action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Chip from "@mui/material/Chip";
import { METHODS } from "../../services/api";
import {
  Typography,
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useStyles from "./styles";
import { dateTimeFormat, TimeLeft } from "../../constant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function AttendClass({ setEnrollId, enrollId, setStepCompleted, setDisable, completed }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ User }) => User);
  const { data = [] } = useSelector(({ Class }) => Class.allClasses);
  // const [enrollId, setEnrollId] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [proceed, setProceed] = useState(!!completed && enrollId == null);
  const [chooseClassAgain, setChooseClassAgain] = useState(false);
  const numOfClassesToShow = 6;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(classActions.getClasses());
  }, [dispatch]);

  const languageMap = {
    hi: "Hindi",
    te: "Telugu",
    en: "English",
    ta: "Tamil",
    cohort: "Batch",
  };

  const possibleClasses = data?.slice(0, numOfClassesToShow) || [];
  
  const enrolledClass =
      !chooseClassAgain &&
      possibleClasses.find(item => item.id === enrollId); 
      //&& new Date() < new Date(item.start_time)); // didn't already start

  const sliceData = (enrolledClass && [enrolledClass]) || possibleClasses;

  const enrollClass = (Class) => {
    setOpen(false);
    setEnrollId(Class.id);
    // localStorage.setItem("classes", JSON.stringify([Class]));
    setChooseClassAgain(false);
    const notify = () => {
      toast.success("You have been enrolled to class successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2500,
      });
    };
    axios
      .post(
        `${process.env.REACT_APP_MERAKI_URL}/classes/${Class.id}/register`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user.data.token,
            "register-to-all": "false",
          },
        }
      )
      .then((res) => {
        notify();
      });
  };

  const dropOutClass = (Class) => {
    setOpen(false);
    setProceed(false);
    setEnrollId(null);
    //localStorage.setItem("proceed", false);
    setChooseClassAgain(true);
    const notify = () => {
      toast.success("You have been dropout the class successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2500,
      });
    };
    return axios({
      method: METHODS.DELETE,
      url: `${process.env.REACT_APP_MERAKI_URL}/classes/${Class.id}/unregister`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
        "unregister-all": "false",
      },
    }).then(() => {
      /*
      sliceData = [];
      data &&
        data.slice(0, numOfClassesToShow).map((item) => {
          sliceData.push(item);
        });
      localStorage.setItem("classes", JSON.stringify(sliceData));
      */
      notify();
    });
  };

  const EnrolledAndTimer = ({ item }) => {
    const [Timer, setTimer] = useState(TimeLeft(item.start_time));
    const ONE_MINUTE = 60000; //millisecs
    setInterval(() => {
      setTimer(TimeLeft(item.start_time));
    }, ONE_MINUTE);
    return (
      <>
        {Timer == "joinNow" ? (
          <a
            style={{
              textDecoration: "none",
            }}
            href={item.meet_link}
            target="_blank"
          >
            <Button
              onClick={() => {
                setProceed(true);
                // localStorage.setItem("proceed", true);
                setStepCompleted();
                setDisable(false);
              }}
              variant="contained"
              fullWidth
            >
              Join Now
            </Button>
          </a>
        ) : (
          <Button disabled={true} variant="contained" fullWidth>
            Starts in {Timer}
          </Button>
        )}
      </>
    );
  };
  return (
    <Container sx={{ mt: 5, mb: 15 }} maxWidth="lg">
      {proceed ? (
        <>
          <Container maxWidth="sm">
            <Typography variant="h6">
              Please choose a class to attend
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body1">
              Attending a class will help you observe how the teacher and
              students interact with each other. You may also stay a bit after
              the class to chat with the teacher. Once completed, please return
              to complete the onboarding.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <span style={{ fontWeight: "bold" }}>Note:</span> In case you
              missed to attend the previous class, it’s recommended to
              <Button
                variant="text"
                onClick={() => {
                  setProceed(false);
                  setEnrollId(null);
                  // localStorage.setItem("proceed", false);
                  setChooseClassAgain(true);
                }}
              >
                enroll to another class
              </Button>
              else please proceed
            </Typography>
            <Box sx={{ display: "flex", mt: 2 }}>
              <CheckCircleIcon color="primary" />
              <Typography sx={{ ml: 2 }}>
                I have attended and got familiar with how classes are conducted
                on Meraki
              </Typography>
            </Box>
          </Container>
        </>
      ) : (
        <>
          <Container maxWidth="md">
            <Typography variant="h6" gutterBottom>
              Please choose a class to attend
            </Typography>
            <Typography variant="body1" gutterBottom>
              Attending a class will help you observe how the teacher and
              students interact with each other. You may also stay a bit after
              the class to chat with the teacher. Once, completed please return
              to complete the onboarding
            </Typography>
          </Container>
          <Grid sx={{ mt: 5 }} container spacing={4}>
            {sliceData &&
              sliceData.map((item) => (
                <Grid item xs={12} ms={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="subtitle1">
                        {item.title}
                      </Typography>
                      <Box sx={{ display: "flex", mt: 2 }}>
                        <Chip color="primary" label="Batch" />
                        <Chip
                          color="primary"
                          sx={{ ml: 1 }}
                          label={languageMap[item.lang]}
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Typography>
                          {/* {moment(item.start_time).format("DD-MM-YYYY")} */}
                          {dateTimeFormat(item.start_time).finalDate} ,{" "}
                          {/* {dateTimeFormat(item.end_time).finalDate} */}
                          {moment(item.start_time).format("hh:mm a")} -
                          {moment(item.end_time).format("hh:mm a")}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{ mt: 2 }}
                        gutterBottom
                        variant="subtitle1"
                      >
                        {item.facilitator.name}
                      </Typography>

                      <Typography gutterBottom variant="body2">
                        Please join at least 10 minutes before the scheduled
                        time
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {sliceData && sliceData.length > 1 ? (
                        <Button
                          onClick={() => {
                            enrollClass(item);
                          }}
                          variant="contained"
                          color="primary"
                          fullWidth
                        >
                          Enroll
                        </Button>
                      ) : (
                        <EnrolledAndTimer item={item} />
                      )}
                    </CardActions>
                  </Card>
                  <Box>
                    {sliceData && sliceData.length == 1 && (
                      <Button
                        sx={{ mt: 5 }}
                        onClick={handleClickOpen}
                        color="error"
                        variant="text"
                      >
                        Can't attend on this date?
                      </Button>
                    )}
                  </Box>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Confirm dropping out"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Something urgent came up? Keep an eye for future doubt
                        classes
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Stay Enrolled</Button>
                      <Button
                        color="error"
                        onClick={() => {
                          dropOutClass(item);
                        }}
                        autoFocus
                      >
                        Drop Out
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default AttendClass;
