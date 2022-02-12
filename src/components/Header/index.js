import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { METHODS } from "../../services/api";

import { PATHS, NAMES } from "../../constant";
import { actions as userActions } from "../User/redux/action";
import { hasOneFrom } from "../../common/utils";
import "./styles.scss";

const AuthenticatedHeaderOption = () => {
  const [partnerId, setPartnerId] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(({ User }) => User);
  const rolesList = user.data.user.rolesList;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/users/me`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setPartnerId(res.data.user.partner_id);
    });
  }, []);

  const partnerGroupId = user.data.user.partner_group_id;

  const canSpecifyPartnerGroupId =
    hasOneFrom(rolesList, ["admin", "partner", "partner_view"]) &&
    user.data.user.partner_group_id;

  const canSpecifyUserBaseRole = rolesList.indexOf("admin") > -1;

  const canSpecifyPartner =
    hasOneFrom(rolesList, ["partner", "partner_view", "partner_edit"]) &&
    partnerId != null;

  const options = ["ADMISSION", "COURSE", "MENTOR", "CLASS", "OPPORTUNITIES", "AFE"];
  const displayOptions = window.innerWidth < 900 ?
      options : 
      options.slice(1, options.length/2 + 1)
      .concat(options[0]).concat(options.slice(options.length/2 + 1));

  return (
    <>
      {canSpecifyUserBaseRole ? (
        <>
          <a className="item" href={PATHS.USER}>
            User
          </a>

          <a className="item" href={PATHS.VOLUNTEER}>
            Volunteers
          </a>
          <a className="item" href={PATHS.PARTNERS}>
            Partners
          </a>
        </>
      ) : null}

      {canSpecifyPartnerGroupId || canSpecifyPartner ? (
        <>
          <a
            className="item"
            href={
              canSpecifyPartnerGroupId
                ? `${PATHS.STATE}/${partnerGroupId}`
                : `${PATHS.PARTNERS}/${partnerId}`
            }
          >
            Dashboard
          </a>
        </>
      ) : null}

      {displayOptions.map(
        (item) => (
          <MenuOption
            item={item}
            className={`item${item === options[0] ? " first-right" : ""}`}
          />
        )
      )}

      <a>
        <i
          class="fa fa-user-circle-o profile-icon"
          onClick={() => setOpen(!open)}
        ></i>
      </a>
      {open && (
        <div className="dropdown-wrapper">
          <ul className="dropdown-menu">
            <li className="dropdown-menu__item">
              <a className="item" href={PATHS.PROFILE}>
                Profile
              </a>
            </li>
            <li className="dropdown-menu__item">
              <a
                className="logout-btn"
                onClick={() => dispatch(userActions.logout())}
              >
                {" "}
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

const AuthenticatedLeftHeaderOption = () => {
  return (
    <>
      {["COURSE", "MENTOR", "CLASS"].map((item) => (
        <MenuOption item={item} className="item" />
      ))}
    </>
  );
};

const PublicMenuOption = () => {
  return (
    <>
      <a className="item first-right" href={PATHS.AFE}>
        Amazon Partnership
      </a>
      <a className="item" href={PATHS.LOGIN}>
        Login/Signup
      </a>
    </>
  );
};

const PublicLeftMenuOption = () => {
  return (
    <a className="item" href={PATHS.COURSE}>
      Courses
    </a>
  );
};

const MenuOption = (props) => {
  return (
    <a className={props.className} href={PATHS[props.item]}>
      {NAMES[props.item]}
    </a>
  );
};

function Header() {
  const { data } = useSelector(({ User }) => User);
  const isAuthenticated = data && data.isAuthenticated;

  return (
    <div className="ng-header ">
      <input type="checkbox" id="nav-check" />
      <div className="logo">
        <a href="/">
          <div className="meraki-logo" />
        </a>
      </div>

      <div className="dropDown-btn">
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <div className="option">
        {isAuthenticated ? <AuthenticatedHeaderOption /> : <PublicMenuOption />}
      </div>
    </div>
  );
}

export default Header;
