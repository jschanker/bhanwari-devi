import React from "react";
import { useSelector } from "react-redux";
import HeaderNavLink from "../HeaderNavlink";
import Message from "../../common/Message";
import { PATHS } from "../../../constant";

function AdminHeader({ toggleDrawer }) {
  const user = useSelector(({ User }) => User);
  const partnerGroupId = user.data.user.partner_group_id;

  return (
    <>
      <HeaderNavLink
        to={PATHS.USER}
        text={<Message constantKey="STUDENTS" />}
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.VOLUNTEER}
        text={<Message constantKey="VOLUNTEERS" />}
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.PARTNERS}
        text={<Message constantKey="PARTNERS" />}
        toggleDrawer={toggleDrawer}
      />
      {partnerGroupId && (
        <HeaderNavLink
          to={`${PATHS.STATE}/${partnerGroupId}`}
          text={<Message constantKey="DASHBOARD" />}
          toggleDrawer={toggleDrawer}
        />
      )}
    </>
  );
}

export default AdminHeader;