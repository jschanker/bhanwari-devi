import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/system";
import useStyles from "./style";
import useMediaQuery from "@mui/material/useMediaQuery";
import { breakpoints } from "../../theme/constant";
import axios from "axios";
import { METHODS } from "../../services/api";
import { useSelector } from "react-redux";
// import NewVolunteerDashboard from ".";

const MenuComponent = (props) => {
  const classes = useStyles();
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const {
    itemname,
    itemId,
    setStatusName,
    setStatusDialog,
    setStatusId,
    userId,
    delfun,
    setdelFun,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const user = useSelector(({ User }) => User);

  const deleteUser = () => {
    return axios({
      url: `${process.env.REACT_APP_MERAKI_URL}/volunteers`,
      method: METHODS.DELETE,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
      data: {
        volunteer_ids: [itemId],
      },
    }).then((res) => {
      console.log("res", res);
    });
  };
  // useEffect(()=>{
  //   axios
  //   .delete(
  //     `${process.env.REACT_APP_MERAKI_URL}volunteer/${userId}`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: user.data.token,
  //       },
  //     }
  //   ).then((response)=>{console.log(response,"data");
  //   setDelData(response.data)
  // })
  //   .catch((err)=>{console.log(err,"error")})
  // },[])

  const openDots = anchorEl;
  const handleClickDots = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDots = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={openDots ? "long-menu" : undefined}
        aria-expanded={openDots ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClickDots}
      >
        <MoreVertIcon sx={{ color: "#BDBDBD" }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={openDots}
        onClose={handleCloseDots}
        PaperProps={{
          sx: {
            width: "15ch",
            boxShadow: "none",
            ml: isActive ? "-9.5px" : "-99.5px",
          },
        }}
      >
        <Box className={classes.menuContainer}>
          <Typography
            // sx={{
            //   width: "128px",
            //   height: "48px",
            //   display: "flex",
            //   flexDirection: "row",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   color: "black",
            //   fontWeight: "400",
            //   fontSize: "14px",
            //   cursor: "pointer",
            // }}
            className={classes.menuTypography}
            onClick={() => {
              setStatusName(itemname);
              setStatusDialog(true);
              setStatusId(itemId);
            }}
          >
            Change Status
          </Typography>
          <Typography
            className={classes.menuBtn}
            onClick={() => {
              setStatusId(itemId);
              deleteUser();
              handleCloseDots();
            }}
          >
            Delete
          </Typography>
        </Box>
      </Menu>
      {/* <NewVolunteerDashboard 
      /> */}
    </div>
  );
};

export default MenuComponent;
