/*
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

const rolesLandingPages = {
  [STUDENT]: PATHS.NEWUSER_DASHBOARED,
  [ADMIN]: PATHS.PARTNERS,
  [VOLUNTEER]: PATHS.CLASS,
  [PARTNER]: PATHS.PARTNERS,
};

const SELECTED_ROLE_KEY = "selectedRole";

function ChangeRoleRow({
  role,
  setSwitchView,
  handleCloseSwitchView,
  switchView,
  partner,
}) {
  const classes = useStyles();

  rolesLandingPages.partner = partner;
  const roleLandingPage = rolesLandingPages[role];

  return roleLandingPage ? (
    <MenuItem
      onClick={() => {
        setSwitchView(role);
        localStorage.setItem(SELECTED_ROLE_KEY, role);
        handleCloseSwitchView();
      }}
      sx={{ margin: "0px 10px" }}
      className={switchView === role && classes.bgColor}
    >
      <NavLink to={roleLandingPage} className={classes.link}>
        <Message constantKey={MENU_ITEMS[role]?.msgKey} />
      </NavLink>
    </MenuItem>
  ) : (
    ""
  );
}

function ChangeRolesView() {
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
      {rolesList.length > 1 ? (
        <>
          <MenuItem onClick={handleOpenSwitchView}>
            <Typography variant="subtitle1">Switch Views</Typography>
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
              <SwitchView
                role={role}
                setSwitchView={setSwitchView}
                handleCloseSwitchView={handleCloseSwitchView}
                switchView={switchView}
                partner={
                  canSpecifyPartnerGroupId
                    ? `${PATHS.STATE}/${partnerGroupId}`
                    : `${PATHS.PARTNERS}/${partnerId}`
                }
              />
            ))}
          </Menu>
        </>
      ) : (
        rolesList.length !== 0 && (
          <MenuItem
            onClick={() => {
              setStudentView(!studentView);
            }}
          >
            <NavLink
              to={
                studentView === false
                  ? interpolatePath(PATHS.PATHWAY_COURSE, {
                      pathwayId: pythonPathwayId, // want to use dashboard?
                    })
                  : rolesLandingPages[rolesList[0]]
              }
              className={classes.link}
            >
              {studentView
                ? `Switch to ${rolesList[0]} View`
                : 'Switch to student View'}
            </NavLink>
          </MenuItem>
        )
      )}
    </Box>
  );
}


export default ChangeRolesView;
*/