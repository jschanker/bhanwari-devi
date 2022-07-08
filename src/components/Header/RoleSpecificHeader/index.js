import React from "react";
import StudentHeader from "../StudentHeader";
import AdminHeader from "../AdminHeader";
import VolunteerHeader from "../VolunteerHeader";
import PartnerHeader from "../PartnerHeader";

function RoleSpecificHeader({ role, isUniqueRole, leftDrawer, toggleDrawer }) {
  const drawerProps = {leftDrawer, toggleDrawer};

  const roleSpecificComponentMap = {
    [STUDENT]: <StudentHeader isUniqueRole={isUniqueRole} {...drawerProps} />,
    [ADMIN]: <AdminHeader {...drawerProps} />,
    [VOLUNTEER]: <VolunteerHeader {...drawerProps} />,
    [PARTNER]: <PartnerHeader {...drawerProps} />,
  };

  return roleSpecificComponentMap[role];
}

export default RoleSpecificHeader;
