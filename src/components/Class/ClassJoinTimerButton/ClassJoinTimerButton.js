import React, { useState, useEffect } from "react";
import { timeLeftFormat, minutesToNow } from "../../../common/date";
import {
  getObjectState,
  getItemInState,
  setItemInState 
} from "../../../common/storage";
import { Button } from "@mui/material";
import ExternalLink from "../../common/ExternalLink";

function ClassJoinTimerButton({ startTime, link, joinMinutesBefore=10, joinMinutesAfter=Infinity, joinOnClick }) {
  const ONE_SECOND = 1000; //millisecs
  const ONE_MINUTE = 60 * ONE_SECOND;
  const CAN_JOIN = "Join Now";
  const minutesToStart = minutesToNow(startTime);
  // const TOO_LATE = "less than a minute (too late to join)";
  const CLASS_PAST_START = " more than " + joinMinutesAfter + "in progress" +
      "or concluded (too late to join)";
  
  const timeLeftFormatOptions = {
    expiredText: CLASS_PAST_START,
    /*precision: [2, 2, 2, 2, 1, 1],
    cutoffTextArr: ["", "", "", "", CAN_JOIN, TOO_LATE],
    cutoffNumArr: [0, 0, 0, 0, 10, 60]*/
  };
  const [timeRemainingMsg, setTimeRemainingMsg] = useState(
    timeLeftFormat(startTime, timeLeftFormatOptions)
  );
  const [didJoin, setDidJoin] = useState(
    getItemInState("TimerButtonComponent", "state", "classesJoined")
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingMsg(timeLeftFormat(startTime, timeLeftFormatOptions));
    }, ONE_MINUTE);
    return () => clearInterval(timer); // cleans up on unmount
  }, [startTime]);

  return (
    <>
      {minutesToStart <= joinMinutesBefore &&
       minutesToStart > -joinMinutesAfter ? (
        <ExternalLink
          style={{
            textDecoration: "none"
          }}
          href={link}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              setDidJoin(true)
              typeof joinOnClick === 'function' && joinOnClick(e);
            }}
          >
            {CAN_JOIN}
          </Button>
        </ExternalLink>
      ) : (
        <Button disabled={true} variant="contained">
          Class in {timeRemainingMsg}
        </Button>
      )}
    </>
  );
}

export default ClassJoinTimerButton;