import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import useStyles from "../styles";
import { breakpoints } from "../../../theme/constant";
// import { dateTimeFormat, TimeLeft } from "../../../constant";
// import { timeLeftFormat } from "../../common/date";
import { format, dateTimeFormat, timeLeftFormat } from "../../../common/date";
import { METHODS } from "../../../services/api";
import { actions as classActions } from "../redux/action";
import "./styles.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../common/Loader";
import { Typography, Card, Grid, Button, CardActions } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import ClassJoinTimerButton from "../ClassJoinTimerButton";
import MergeClass from "../MergeClass";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useParams } from "react-router-dom";
import EditClass from "../EditClass";
toast.configure();

function ClassCard() {
  const params = useParams();
  console.log(params);
  const classId = params.batchId;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [enrollShowModal, setEnrollShowModal] = React.useState(false);
  const [unenrollShowModal, setunenrollShowModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [editShowModal, setEditShowModal] = React.useState(false);
  const [deleteCohort, setDeleteCohort] = React.useState(false);
  const [indicator, setIndicator] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ User }) => User);
  const [canJoin, setCanJoin] = useState(false);
  const [classesData, setClassesData] = useState([]);
  // const classStartTime = item.start_time; // && item.start_time.replace("Z", "");
  // const classEndTime = item.end_time; // && item.end_time.replace("Z", "");
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/batches/classes/${classId}`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setClassesData(res.data);
    });
  }, [classId]);
  console.log(classesData, "classes");
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");

  const languageMap = {
    hi: "Hindi",
    te: "Telugu",
    en: "English",
    ta: "Tamil",
    doubt_class: "Doubt Class",
  };

  const handleClickOpenEnroll = () => {
    setEnrollShowModal(!enrollShowModal);
    setIndicator(false);
  };

  const rolesList = user.data.user.rolesList;
  let flag = false;
  rolesList.includes("admin") || rolesList.includes("classAdmin")
    ? (flag = true)
    : (flag = false);

  // API CALL FOR DROP OUT
  const handleDropOut = (Id) => {
    setLoading(true);
    const notify = () => {
      toast.success("You have been dropped out of class successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2500,
      });
    };
    let getNotify = false;
    setunenrollShowModal(!unenrollShowModal);
    const timer = setTimeout(() => {
      getNotify = true;
      dispatch(classActions.dropOutClass(Id));
      setLoading(false);
      notify();
    }, 10000);
    return axios({
      method: METHODS.DELETE,
      url: `${process.env.REACT_APP_MERAKI_URL}/classes/${Id}/unregister?unregister-all=${indicator}`,
      // url: `${process.env.REACT_APP_MERAKI_URL}/classes/${Id}/unregister`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
        // "unregister-to-all": indicator,
      },
    }).then((res) => {
      if (!getNotify) {
        notify();
        clearTimeout(timer);
        setLoading(false);
      }
      dispatch(classActions.dropOutClass(Id));
    });
  };

  //console.log("indicator", indicator);
  /*
  const EnrolledAndTimer = () => {
    const timeLeftOptions = {
      precision: [3, 3, 3, 2, 2, 1],
      cutoffNumArr: [0, 0, 0, 0, 10, 60],
      cutoffTextArr: ["", "", "", "", "joinNow", "joinNow"],
      expiredText: "joinNow",
    };
    const [Timer, setTimer] = useState(
      timeLeftFormat(item.start_time, timeLeftOptions)
    );
    const ONE_MINUTE = 60000; //millisecs
    setInterval(() => {
      setTimer(timeLeftFormat(item.start_time, timeLeftOptions));
    }, ONE_MINUTE);
    return (
      <>
        {Timer === "joinNow" ? (
          <ExternalLink
            style={{
              textDecoration: "none",
            }}
            href={item.meet_link}
          >
            <Button variant="contained" fullWidth>
              Join Now
            </Button>
          </ExternalLink>
        ) : (
          <Button disabled={true} variant="contained">
            Starts in {Timer}
          </Button>
        )}
      </>
    );
  };
  */
  // const ACBPathway = classesData?.find((path) => {
  //   return item.pathway_id === path.id;
  // });
  console.log(classesData);

  return (
    <>
      <Grid container spacing={isActive ? "0px" : "16px"} maxWidth="lg">
        {classesData.map((item) => (
          <Grid item xs={12} ms={6} md={4}>
            <Card
              elevation={2}
              sx={{
                p: 4,
                mt: isActive ? 4 : 5,
                bgcolor: canJoin ? "secondary.light" : "primary.lighter",
              }}
              className={classes.card}
            >
              <Typography
                variant="subtitle1"
                color="#6D6D6D"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ fontSize: "18px", fontWeight: "400" }}
                  variant="subtitle2"
                >
                  {item?.title}
                </Typography>
                {/* {item?.enrolled && (
            <i
              className="check-icon check-icon fa fa-check-circle
          "
              style={{ backgroundColor: "transparent" }}
            >
              Enrolled
            </i>
          )} */}
                {((rolesList.length === 0 && item.enrolled) ||
                  (rolesList.length >= 1 &&
                    (item?.facilitator?.email === user.data.user.email ||
                      flag))) && <EditClass item={item} />}
              </Typography>
              {/* dialog box for edit delete and merge class  */}

              {/* {ACBPathway?.code === "ACB" && !item?.merge_class && (
                <MergeClass
                  item={item}
                  itemID={item.id}
                  PathwayID={item.pathway_id}
                  pathwayFilter={pathwayFilter}
                  setRefreshKey={setRefreshKey}
                />
              )} */}

              {/* it will show when two class merged */}
              {/* {ACBPathway?.code === "ACB" && item?.merge_class && (
          <Typography variant="body2" sx={{ display: "flex" }}>
            <img
              className={classes.icons}
              src={require("../assets/mergeClass.png")}
              height="26px"
              width="26px"
            />

            {item?.merge_class}
          </Typography>
        )} */}
              {!item.title.toLowerCase().includes("scratch") && (
                <Typography
                  // sx={{ fontSize: "18px", fontWeight: "400" }}
                  variant="subtitle1"
                >
                  {item.sub_title}
                </Typography>
              )}
              <Typography variant="body1" sx={{ display: "flex" }}>
                <img
                  className={classes.icons}
                  src={require("../assets/calendar.svg")}
                />
                {format(item.start_time, "dd MMM yy")}
              </Typography>

              <Typography variant="body1" sx={{ display: "flex" }}>
                <img
                  className={classes.icons}
                  src={require("../assets/time.svg")}
                />
                {format(item.start_time, "hh:mm aaa")} -{" "}
                {format(item.end_time, "hh:mm aaa")}
              </Typography>
              {/* <Typography variant="body1" sx={{ display: "flex" }}>
        <img className={classes.icons} src={require("../assets/time.svg")} />
        {format(classStartTime, "hh:mm aaa")} -{" "}
        {format(classEndTime, "hh:mm aaa")}
      </Typography> 
        <Typography variant="body1" sx={{ display: "flex" }}>
          <img
            className={classes.icons}
            src={require("../assets/facilitator.svg")}
          />
          {item?.volunteer?.name || item?.facilitator?.name}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex" }}>
          <img
            className={classes.icons}
            src={require("../assets/language.svg")}
          />
          {languageMap[item?.lang]}
        </Typography>

        {/* it's for enroll class, join class and  class Timer button */}
              <CardActions className={classes.cardActions}>
                {item?.enrolled ? (
                  loading ? (
                    <div className="loader-button">
                      <Loader />
                    </div>
                  ) : (
                    <ClassJoinTimerButton
                      startTime={item?.start_time}
                      link={item?.meet_link}
                      onCanJoin={setCanJoin}
                    />
                  )
                ) : loading ? (
                  <div className="loader-button">
                    <Loader />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="text"
                    onClick={() => {
                      handleClickOpenEnroll(item.id);
                    }}
                    endIcon={<ArrowRightAltIcon />}
                  >
                    Enroll
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ClassCard;
