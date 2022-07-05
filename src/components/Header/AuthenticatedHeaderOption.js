import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { PATHS, interpolatePath } from "../../constant";
import { hasOneFrom } from "../../common/utils";
import { actions as userActions } from "../User/redux/action";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import useStyles from "./styles";
import { DropDown, MobileDropDown } from "./DropDown";
import { sendToken } from "../User/redux/api";
import { actions as pathwayActions } from "../../components/PathwayCourse/redux/action";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import HeaderNavLink from "./HeaderNavlink";
import UserMenu from "./UserMenu";
import SearchBar from "../SearchBar";
import Tooltip from "@mui/material/Tooltip";
import Message from "../common/Message";
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
} from "./constant";
import StudentHeader from "./StudentHeader";
import AdminHeader from "./AdminHeader";
import VolunteerHeader from "./VolunteerHeader";
import SearchHeader from "./SearchHeader";
import ChangeRolesView from "./ChangeRolesView";

const savedRolesToKeysMap = Object.keys(ROLES)
    .reduce((roleKeyMap, roleKey) => {
      roleKeyMap[ROLES[roleKey].savedValue] = roleKey;
      return roleKeyMap;
    }, {});

const SELECTED_ROLE_KEY = "selectedRole";

function AuthenticatedHeaderOption({
  toggleDrawer,
  leftDrawer,
  handleSearchChange,
}) {
  const [partnerId, setPartnerId] = useState("");
  // const [profile, setProfile] = useState("");
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [learn, setLearn] = React.useState(null);
  const [dropDown, setDropDown] = React.useState(null);
  const [studentView, setStudentView] = React.useState(false);
  const [roleView, setRoleView] = React.useState(
    localStorage.getItem(SELECTED_ROLE_KEY)
  );
  const dispatch = useDispatch();
  const user = useSelector(({ User }) => User);
  const rolesList = (user.data.user.rolesList || [])
      .map(savedRole => savedRolesToKeysMap[savedRole] || savedRole);
  const pathway = useSelector((state) => state.Pathways);
  const classes = useStyles();

  useEffect(() => {
    sendToken({ token: user.data.token }).then((res) => {
      setPartnerId(res.data.user.partner_id);
      // setProfile(res.data.user.profile_picture);
    });
  }, []);

  useEffect(() => {
    dispatch(pathwayActions.getPathways());
  }, [dispatch]);

  const pythonPathwayId =
      pathway.data?.pathways.find((pathway) => pathway.code === "PRGPYT")?.id;

  const partnerGroupId = user.data.user.partner_group_id;

  const canSpecifyPartnerGroupId =
    hasOneFrom(rolesList, [ADMIN, PARTNER, PARTNER_VIEW]) &&
    user.data.user.partner_group_id;

  const canSpecifyUserBaseRole = rolesList.indexOf(ADMIN) > -1; //student

  const merakiStudents = rolesList.length < 1; //admin

  const volunteer = rolesList.indexOf(VOLUNTEER) > -1;

  const canSpecifyPartner =
    hasOneFrom(rolesList, [PARTNER, PARTNER_VIEW, PARTNER_EDIT]) &&
    partnerId != null;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: {
            xs: leftDrawer ? "block" : "none",
            md: leftDrawer ? "none" : "flex",
          },
        }}
      >
        {(roleView === STUDENT || merakiStudents || studentView) && (
          <StudentHeader 
            leftDrawer={leftDrawer}
            toggleDrawer={toggleDrawer}
            onlyRole={merakiStudents}
          />
        )}

        {!studentView && (
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "block",
                md: "flex",
              },
            }}
          >
            {(roleView || rolesList[0]) === ADMIN && (
              <AdminHeader
                {...{toggleDrawer, canSpecifyPartnerGroupId, partnerGroupId}}
              />
            )}

            {(roleView || rolesList[0]) === VOLUNTEER && (
              <VolunteerHeader toggleDrawer={toggleDrawer} />
            )}

            {(roleView || rolesList[0]) === PARTNER &&
            // "partner_view" || "partner_edit" || "partner"
            (canSpecifyPartnerGroupId || canSpecifyPartner) ? (
              <>
                <HeaderNavLink
                  to={
                    canSpecifyPartnerGroupId
                      ? `${PATHS.STATE}/${partnerGroupId}`
                      : `${PATHS.PARTNERS}/${partnerId}`
                  }
                  text={<Message constantKey="DASHBOARD" />}
                  toggleDrawer={toggleDrawer}
                />
              </>
            ) : null}
          </Box>
        )}
        {
          !(roleView === STUDENT || merakiStudents || studentView) &&
          !leftDrawer && (
            <SearchHeader />
          )
        }
        <ChangeRolesView {...{roleView, setRoleView, leftDrawer}} />
      </Box>

      {!leftDrawer && <UserMenu />}
    </>
  );
}

export default AuthenticatedHeaderOption;
