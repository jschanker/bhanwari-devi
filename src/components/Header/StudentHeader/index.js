import React from "react";
import { Link } from "react-router-dom";
import { DropDown, MobileDropDown } from "../DropDown";
import {
  Box,
  Typography,
  // Menu,
  MenuItem,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HeaderNavLink from "../HeaderNavlink";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Message from "../../common/Message";
import { PATHS } from "../../constant";
import {
  LEARN_KEY,
  MENU_ITEMS, 
  // ROLES,
  // ADMIN_ROLE_KEY as ADMIN,
  // PARTNER_ROLE_KEY as PARTNER,
  // PARTNER_VIEW_ROLE_KEY as PARTNER_VIEW,
  // PARTNER_EDIT_ROLE_KEY as PARTNER_EDIT,
  // STUDENT_ROLE_KEY as STUDENT,
  // VOLUNTEER_ROLE_KEY as VOLUNTEER,
} from "../constant";

function StudentHeader({ leftDrawer, toggleDrawer, onlyRole }) {
  const [learn, setLearn] = React.useState(null);
  const handleOpenLearn = (event) => {
    setLearn(event.currentTarget);
  };

  const handleCloseLearn = () => {
    setLearn(null);
  };

  <>
    <Box
      sx={{
        flexGrow: 1,
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      <MenuItem onClick={handleOpenLearn}>
        <Typography variant="subtitle1">
          <Message constantKey={MENU_ITEMS[LEARN_KEY].msgKey} />
        </Typography>
        {learn ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </MenuItem>
      <DropDown
        dropDown={LEARN_KEY}
        indicator={learn}
        handleClose={handleCloseLearn}
        toggleDrawer={toggleDrawer}
      />

      <HeaderNavLink
        to={PATHS.NEWUSER_DASHBOARED}
        text={<Message constantKey="DASHBOARD" />}
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.MENTOR}
        text="Mentor"
        toggleDrawer={toggleDrawer}
      />
    </Box>
    <Box
      sx={{
        display: { xs: "block", md: "none" },
      }}
    >
      <MobileDropDown
        menuKey={LEARN_KEY}
        handleClose={handleCloseLearn}
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.NEWUSER_DASHBOARED}
        text={<Message constantKey="DASHBOARD" />}
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.MENTOR}
        text="Mentor"
        toggleDrawer={toggleDrawer}
      />
    </Box>

    <Box
      sx={{
        display: { xs: "block", md: "flex" },
        justifyContent: { xs: "normal", md: "flex-end" },
        width: { xs: 0, sm: "100%" },
        pr: onlyRole && 2,
      }}
    >
      {!leftDrawer && (
        <Link to={PATHS.SEARCHED_COURSE}>
          <Tooltip title="Search the course...">
            <Button color="dark">
              <SearchIcon />
            </Button>
          </Tooltip>
        </Link>
      )}

      <HeaderNavLink
        to={PATHS.ADMISSION}
        text="Navgurukul Admission"
        toggleDrawer={toggleDrawer}
      />
      <HeaderNavLink
        to={PATHS.OPPORTUNITIES}
        text={<Message constantKey="OPPORTUNITIES" />}
        toggleDrawer={toggleDrawer}
      />
    </Box>
  </>
}

export default StudentHeader;