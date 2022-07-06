import React from "react";
import { useSelector } from "react-redux";
import HeaderNavLink from "../HeaderNavlink";
import Message from "../../common/Message";
import { PATHS } from "../../../constant";

function PartnerHeader({ toggleDrawer }) {
  const user = useSelector(({ User }) => User);
  const partnerId = user.data.user.partner_id;
  const partnerGroupId = user.data.user.partner_group_id;

  return (
    <>
      <HeaderNavLink
        to={
          partnerGroupId
            ? `${PATHS.STATE}/${partnerGroupId}`
            : `${PATHS.PARTNERS}/${partnerId}`
        }
        text={<Message constantKey="DASHBOARD" />}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}
