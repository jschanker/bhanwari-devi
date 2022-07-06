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
import PartnerHeader from "./PartnerHeader";
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
  const [RoleSpecificHeader, setRoleSpecificHeader] = React.useState(null);
  // const dispatch = useDispatch();
  // const pathway = useSelector((state) => state.Pathways);

/*
  useEffect(() => {
    sendToken({ token: user.data.token }).then((res) => {
      // setPartnerId(res.data.user.partner_id);
      // setProfile(res.data.user.profile_picture);
    });
  }, []);
*/

  // useEffect(() => {
  //  dispatch(pathwayActions.getPathways());
  //}, [dispatch]);

  // const pythonPathwayId =
  //    pathway.data?.pathways.find((pathway) => pathway.code === "PRGPYT")?.id;

  // const merakiStudents = rolesList.length < 1; //admin

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
        {RoleSpecificHeader}
        <ChangeRolesView 
          {...{setRoleSpecificHeader, leftDrawer, toggleDrawer}}
        />
      </Box>
      {!leftDrawer && <UserMenu />}
    </>
  );
}

export default AuthenticatedHeaderOption;
