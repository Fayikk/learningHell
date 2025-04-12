import React, { Fragment, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { NavLink } from "react-router-dom";
import "./style.css";
import { useSelector } from "react-redux";
import { NavItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const MobileMenu = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);
  const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
  const token = localStorage.getItem("token");

  useEffect(() => {}, [nameIdentifier]);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const menus = [
    {
      id: 1,
      title: t("Courses"),
      link: "/home",
      submenu: [
        {
          id: 11,
          title: t("Categories"),
          link: "/course-2",
        },
      ],
    },
    {
      id: 2,
      title: t("Bootcamps"),
      link: "/Student/Bootcamps",
    },
    {
      id: 2,
      title: t("Become Teacher"),
      link: "/become-teacher",
    },
    {
      id: 3,
      title: t("Cart"),
      link: "/cart",
    },
    {
      id: 3,
      title: t("Blogs"),
      link: "/blogs",
    }
  ];

  return (
    <div>
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => setMenuState(!menuActive)}>
            <i className="ti-close"></i>
          </div>
        </div>

        <ul className="responsivemenu">
          {menus.map((item, mn) => (
            <ListItem className={item.id === openId ? "active" : null} key={mn}>
              {item.submenu ? (
                <Fragment>
                  <p
                    onClick={() => setOpenId(item.id === openId ? 0 : item.id)}
                  >
                    {item.title}
                    <i
                      className={
                        item.id === openId
                          ? "fa fa-angle-up"
                          : "fa fa-angle-down"
                      }
                    ></i>
                  </p>
                  <Collapse
                    in={item.id === openId}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List className="subMenu">
                      <Fragment>
                        {item.submenu.map((submenu, i) => (
                          <ListItem key={i}>
                            <NavLink
                              onClick={ClickHandler}
                              className="active"
                              to={submenu.link}
                            >
                              {submenu.title}
                            </NavLink>
                          </ListItem>
                        ))}
                      </Fragment>
                    </List>
                  </Collapse>
                </Fragment>
              ) : (
                <NavLink className="active" to={item.link}>
                  {item.title}
                </NavLink>
              )}
            </ListItem>
          ))}
          {token ? (
            <Fragment>
              <ListItem>
                <NavLink className="active" to="/MyCourse">
                  {t("My Courses")}
                </NavLink>
              </ListItem>
              <ListItem>
                <p onClick={handleLogout}>{t("Logout")}</p>
              </ListItem>
            </Fragment>
          ) : (
            <Fragment>
              <ListItem>
                <NavLink className="active" to="/login">
                  {t("Sign In")}
                </NavLink>
              </ListItem>
              <ListItem>
                <NavLink className="active" to="/register">
                  {t("Sign Up")}
                </NavLink>
              </ListItem>
            </Fragment>
          )}
        </ul>
      </div>

      <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
        <button type="button" className="navbar-toggler open-btn">
          <span className="icon-bar first-angle"></span>
          <span className="icon-bar middle-angle"></span>
          <span className="icon-bar last-angle"></span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
