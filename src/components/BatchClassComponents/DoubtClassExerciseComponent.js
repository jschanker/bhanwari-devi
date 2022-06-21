import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Card, CardContent, Chip } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import useStyles from "./styles";
import { breakpoints } from "../../theme/constant";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { lang, TimeLeft } from "../../constant";
import { format } from "../../common/date";
import AlertDialog from "./AlertDialog";
import DropOut from "./DropOut";

export const MoreDetails = (props) => {
  const { open, setOpen, isEnrolled, setIsEnrolled } = props;

  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const classes = useStyles();
  const { actions, value } = props;
  console.log(actions, value);
  const toggleDrawer = (changeTo) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(changeTo);
  };
  const [ConfirmationOpen, setConfirmationOpen] = useState(false);

  const [openDropOut, setOpenDropOut] = useState(false);
  const anchorPos = "right";
  const close = () => {
    setConfirmationOpen(false);
  };
  let [TimeLefts, setTimeLefts] = useState(TimeLeft(actions.start_time));
  var ONE_MINUTE = 60 * 1000;
  setInterval(() => {
    setTimeLefts(TimeLeft(actions.start_time));
    console.log("TimeChange");
  }, ONE_MINUTE);
  const closeDropOut = () => {
    setOpenDropOut(false);
  };
  return (
    <div>
      <SwipeableDrawer
        anchor={anchorPos}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            width: anchorPos === "top" || anchorPos === "bottom" ? "auto" : 350,
          }}
          role="presentation"
          onKeyDown={toggleDrawer(false)}
        >
          <Box m={4}>
            <Typography variant="h5" mb={2}>
              Doubt Class
            </Typography>
            <Typography variant="h6" mb={1}>
              {actions?.title}
            </Typography>
            <Box mb={3}>
              <Chip
                label="Doubt Class"
                variant="outlined"
                color="secondary"
                style={{
                  borderRadius: 90,
                  height: 30,
                  backgroundColor: "#DADAEC",
                }}
              />

              <Chip
                label={lang[actions?.lang]}
                variant="outlined"
                color="secondary"
                style={{ marginLeft: 10, borderRadius: 90, height: 30 }}
              />
            </Box>
            <Typography variant="body1">
              Clear your doubts related to the first class of Python and other
              queries during your studies
            </Typography>
            <Typography
              variant="body"
              mt={2}
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
              {actions?.start_time
                ? format(actions?.start_time, "dd MMM yy")
                : ""}
              ,
              {actions?.start_time
                ? format(actions?.start_time, "hh:mm aaa")
                : ""}{" "}
              -{actions?.end_time ? format(actions?.end_time, "hh:mm aaa") : ""}
            </Typography>
            <Typography
              variant="body1"
              mb={2}
              style={{
                display: "flex",
              }}
            >
              {" "}
              <img
                className={classes.icons}
                src={require("./Revision/assets/Group.svg")}
                alt="Students Img"
              />
              {actions?.facilitator_name}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Please join at least 10 mintues before the scheduled time
            </Typography>
            {isEnrolled ? (
              <>
                {TimeLefts == "joinNow" ? (
                  <a
                    style={{
                      textDecoration: "none",
                    }}
                    href={actions?.meet_link}
                    target="_blank"
                  >
                    <Button
                      variant="contained"
                      style={{ marginTop: 20 }}
                      fullWidth
                    >
                      Join Now
                    </Button>
                  </a>
                ) : (
                  <Button
                    disabled={true}
                    variant="contained"
                    sx={{ fontSize: "1rem" }}
                    fullWidth
                    style={{ marginTop: 20 }}
                  >
                    Starts in {TimeLefts}
                  </Button>
                )}
                <DropOut
                  open={openDropOut}
                  close={closeDropOut}
                  title={actions?.title}
                  id={actions?.id}
                  setIsEnrolled={setIsEnrolled}
                />
                <Typography
                  align="center"
                  mt={2}
                  onClick={() => {
                    setOpenDropOut(true);
                  }}
                  variant="body2"
                  color="red"
                  style={{ cursor: "pointer" }}
                >
                  can`t attend?
                </Typography>{" "}
              </>
            ) : (
              <Button
                variant="contained"
                fullWidth
                style={{ marginTop: 20 }}
                onClick={() => setConfirmationOpen(true)}
              >
                Enroll
              </Button>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
      <AlertDialog
        open={ConfirmationOpen}
        close={close}
        title={actions?.title}
        start_time={actions?.start_time}
        end_time={actions?.end_time}
        id={actions?.id}
        exerciseReload={true}
        setIsEnrolled={setIsEnrolled}
        type="DoubtClass"
      />
    </div>
  );
};

const DoubtClassExerciseComponent = (props) => {
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const classes = useStyles();
  const { actions, value } = props;
  const [open, setOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(actions?.is_enrolled);
  return !isEnrolled ? (
    <>
      <Box
        backgroundColor="primary.light"
        p={2}
        mt={2}
        sx={{ borderRadius: "20px" }}
      >
        <Typography
          variant="body1"
          mb={1}
          align="left"
          style={{
            display: "flex",
          }}
        >
          {" "}
          <img
            className={classes.icons}
            src={require("./Revision/assets/Group.svg")}
            alt="Students Img"
          />
          Need help? We got you covered. Enroll in the doubt class on{" "}
          {format(actions?.start_time, "dd MMM yy")}
          at {format(actions?.start_time, "hh:mm aaa")} -{" "}
          {format(actions?.end_time, "hh:mm aaa")}
        </Typography>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            endIcon={<ArrowForwardIosIcon />}
            onClick={() => {
              setOpen(true);
            }}
            sx={{
              width: isActive ? "90%" : "215px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            View Class Details
          </Button>
        </div>
      </Box>
      {/* <MoreDetails
        open={open}
        setOpen={setOpen}
        actions={actions}
        value={value}
        isEnrolled={isEnrolled}
        setIsEnrolled={setIsEnrolled}
      /> */}
      <MoreDetails
        {...{ open, setOpen, actions, value, isEnrolled, setIsEnrolled }}
      />
    </>
  ) : (
    <>
      <MoreDetails
        open={open}
        setOpen={setOpen}
        actions={actions}
        value={value}
        isEnrolled={isEnrolled}
        setIsEnrolled={setIsEnrolled}
      />
      <>
        <Box backgroundColor="primary.light" p={2} mt={2}>
          <Typography variant="h6" mt={1} mb={2}>
            {/* {actions.title} */}
            Upcoming Doubt Class
          </Typography>

          <Typography
            variant="body1"
            mb={2}
            align="left"
            style={{
              display: "flex",
            }}
          >
            <img
              className={classes.icons}
              src={require("./Revision/assets/calender.svg")}
              alt="Students Img"
            />
            {format(actions?.start_time, "dd MMM yy")}
            at {format(actions?.start_time, "hh:mm aaa")} -{" "}
            {format(actions?.end_time, "hh:mm aaa")}
            <img
              className={classes.icons}
              style={{ marginLeft: "10px" }}
              src={require("./Revision/assets/Group.svg")}
              alt="Students Img"
            />
            {/* {actions.facilitator_name} */}
          </Typography>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => {
                setOpen(true);
              }}
              sx={{
                width: isActive ? "90%" : "215px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              View Class Details
            </Button>
          </div>
        </Box>
      </>
    </>
  );
};
export default DoubtClassExerciseComponent;
