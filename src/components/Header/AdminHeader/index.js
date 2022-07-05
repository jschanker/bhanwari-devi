import React from "react";
import HeaderNavLink from "../HeaderNavlink";
import Message from "../../common/Message";
import { PATHS } from "../../../constant";

function AdminHeader({ toggleDrawer, canSpecifyPartnerGroupId, partnerGroupId }) {
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
      {canSpecifyPartnerGroupId && (
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