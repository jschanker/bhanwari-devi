import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../../constant";
import useStyles from "../styles";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Message from "../../common/Message";
import {
  LEARN_KEY,
  MENU_ITEMS, 
  ROLES,
  ADMIN_ROLE_KEY as ADMIN,
  PARTNER_ROLE_KEY as PARTNER,
  PARTNER_VIEW_ROLE_KEY as PARTNER_VIEW,
  PARTNER_EDIT_ROLE_KEY as PARTNER_EDIT,
  STUDENT_ROLE_KEY as STUDENT,
  VOLUNTEER_ROLE_KEY as VOLUNTEER,
} from "../constant";
import StudentHeader from "../StudentHeader";
import AdminHeader from "../AdminHeader";
import VolunteerHeader from "../VolunteerHeader";
import PartnerHeader from "../PartnerHeader";

const rolesLandingPages = {
  [STUDENT]: PATHS.NEWUSER_DASHBOARED,
  [ADMIN]: PATHS.PARTNERS,
  [VOLUNTEER]: PATHS.CLASS,
  [PARTNER]: PATHS.PARTNERS,
};

// keys of roles which every user has
const DEFAULT_ROLES =
    Object.keys(ROLES).filter((role) => ROLES[role].isDefault);

const savedRolesToKeysMap = Object.keys(ROLES)
    .reduce((roleKeyMap, roleKey) => {
      roleKeyMap[ROLES[roleKey].savedValue] = roleKey;
      return roleKeyMap;
    }, {});

const SELECTED_ROLE_KEY = "selectedRole";

function ChangeRole({
  isToggle,
  role,
  setRoleView,
  handleCloseSwitchView,
  roleView,
  partner,
}) {

  const classes = useStyles();
  const styles = isToggle ? {} : { margin: "0px 10px" };
  const roleStr = <Message constantKey = {MENU_ITEMS[role]?.msgKey} />;

  rolesLandingPages.partner = partner;
  const roleLandingPage = rolesLandingPages[role];
  // classes.bgColor doesn't do anything because it's overriden by the
  //     transparency of the list item
  return roleLandingPage ? (
    <MenuItem
      onClick={() => {
        setRoleView(role);
        localStorage.setItem(SELECTED_ROLE_KEY, role);
        !isToggle && handleCloseSwitchView();
      }}
      sx={styles}
      className={roleView === role && classes.bgColor}
    >
      <NavLink to={roleLandingPage} className={classes.link}>
        {
          isToggle ? 
           <Message constantKey="SWITCH_TO_VIEW" args={roleStr} />
           : roleStr  
        }
      </NavLink>
    </MenuItem>
  ) : (
    ""
  );
}

function ChangeRolesView({ setRoleSpecificHeader, leftDrawer, toggleDrawer }) {
  const [roleView, setRoleView] = React.useState(
    localStorage.getItem(SELECTED_ROLE_KEY)
  );
  const [dropDown, setDropDown] = React.useState(null);
  const user = useSelector(({ User }) => User);
  const rolesList = (user.data.user.rolesList || [])
      .map(savedRole => savedRolesToKeysMap[savedRole] || savedRole);
  const rolesListWithDefaults = DEFAULT_ROLES.concat(
      rolesList.filter(roleKey => !DEFAULT_ROLES.includes(roleKey))
  );
  const otherRole = 
      rolesListWithDefaults[(rolesListWithDefaults.indexOf(roleView) + 1) % 2];

  const partnerGroupId = user.data.user.partner_group_id;
  const partnerId = user.data.user.partner_id;

  const commonProps = {
    setRoleView,
    roleView,
    partner: partnerGroupId
      ? `${PATHS.STATE}/${partnerGroupId}`
      : `${PATHS.PARTNERS}/${partnerId}`
  };

  const drawerProps = {leftDrawer, toggleDrawer};

  const roleSpecificComponentMap = {
    [STUDENT]: (
      <StudentHeader
        {...drawerProps}
        onlyRole={rolesListWithDefaults.length === 1}
      />
    ),
    [ADMIN]: <AdminHeader {...drawerProps} />,
    [VOLUNTEER]: <VolunteerHeader {...drawerProps} />,
    [PARTNER]: <PartnerHeader {...drawerProps} />,
  };

  const handleOpenSwitchView = (event, menu) => {
    setDropDown(event.currentTarget);
  };

  const handleCloseSwitchView = () => {
    setDropDown(null);
  };

  React.useEffect(() => {
    setRoleSpecificHeader(
      roleSpecificComponentMap[roleView || rolesList[0] || DEFAULT_ROLES[0]]
    );
  }, [roleView]);

  return (
    <Box
      sx={{
        flexGrow: 0,
        display: {
          xs: leftDrawer ? "block" : "none",
          md: leftDrawer ? "none" : "flex",
        },
      }}
    >
      {rolesListWithDefaults.length > 2 ? (
        <>
          <MenuItem onClick={handleOpenSwitchView}>
            <Typography variant="subtitle1">
              <Message constantKey="SWITCH_VIEWS" />
            </Typography>
            {dropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </MenuItem>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={dropDown}
            anchorOrigin={{
              vertical: "top",
              horizontal: leftDrawer ? "left" : "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: leftDrawer ? "left" : "right",
            }}
            open={Boolean(dropDown)}
            onClose={handleCloseSwitchView}
          >
            {rolesListWithDefaults.map((role) => (
              <ChangeRole
                handleCloseSwitchView={handleCloseSwitchView}
                role={role}
                {...commonProps}
              />
            ))}
          </Menu>
        </>
      ) : (
        rolesListWithDefaults.length === 2 && (
          <ChangeRole isToggle={true} role={otherRole} {...commonProps} />
        )
      )}
    </Box>
  );
}

export default ChangeRolesView;