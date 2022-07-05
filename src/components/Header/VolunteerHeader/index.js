import React from "react";
import HeaderNavLink from "../HeaderNavlink";
import Message from "../../common/Message";
import { PATHS } from "../../../constant";

function VolunteerHeader({ toggleDrawer }) {
  return (
    <>
      <HeaderNavLink
        to={PATHS.CLASS}
        text={<Message constantKey="CLASSES" />}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}

export default VolunteerHeader;