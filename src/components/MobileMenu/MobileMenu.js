import React, { Fragment, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { NavLink } from "react-router-dom";
import "./style.css";
import "./modernStyle.css";
import { useSelector } from "react-redux";
import { NavItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaBook, FaChalkboardTeacher, FaGraduationCap, FaShoppingCart, FaNewspaper, FaAngleDown, FaAngleUp, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from "react-icons/fa";

const MobileMenu = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);
  const authState = useSelector((state) => state.authStore);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleOutsideClick = (e) => {
      if (menuActive && !e.target.closest('.mobileMenu') && !e.target.closest('.showmenu')) {
        setMenuState(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [menuActive]);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
    setMenuState(false); // Close menu after clicking a link
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setMenuState(false); // Close menu after logout
    window.location.reload();
  };
  const menus = [
    {
      id: 1,
      title: t("Courses"),
      link: "/home",
      icon: <FaBook />,
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
      icon: <FaChalkboardTeacher />,
    },
    {
      id: 3,
      title: t("Free Content"),
      link: "/Free/Content",
      icon: <FaGraduationCap />,
    },
    {
      id: 4,
      title: t("Become Teacher"),
      link: "/become-teacher",
      icon: <FaChalkboardTeacher />,
      hideWhen: () => authState.role && authState.role.includes("Instructor"),
    },
    {
      id: 5,
      title: t("Cart"),
      link: "/cart",
      icon: <FaShoppingCart />,
    },
    {
      id: 6,
      title: t("Blogs"),
      link: "/blogs",
      icon: <FaNewspaper />,
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
        
        {/* User Info Section - Only visible when logged in */}
        {token && (
          <div className="user-info">
            <div className="user-avatar">
              {authState.userName ? authState.userName.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div className="user-name">
              {authState.userName || t("User")}
            </div>
          </div>
        )}
        
        <div className="menu-divider"></div>

        <ul className="responsivemenu">
          {/* Dynamic Menu Items */}
          {menus.map((item, mn) => {
            // Skip items that should be hidden
            if (item.hideWhen && item.hideWhen()) return null;
            
            return (
              <ListItem className={item.id === openId ? "active" : null} key={mn}>
                {item.submenu ? (
                  <Fragment>
                    <p
                      onClick={() => setOpenId(item.id === openId ? 0 : item.id)}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.icon}
                        {item.title}
                      </span>
                      {item.id === openId ? <FaAngleUp /> : <FaAngleDown />}
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
                  <NavLink to={item.link} onClick={ClickHandler}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.icon}
                      {item.title}
                    </span>
                  </NavLink>
                )}
              </ListItem>
            );
          })}
          
          <div className="menu-divider"></div>
          
          {/* User-specific Menu Items */}
          {token ? (
            <Fragment>
              <ListItem>
                <NavLink to="/MyCourse" onClick={ClickHandler}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBook />
                    {t("My Courses")}
                  </span>
                </NavLink>
              </ListItem>
              
              {/* Instructor Menu Items */}
              {authState.role && authState.role.includes("Instructor") && (
                <>
                  <ListItem>
                    <NavLink to="/Instructor" onClick={ClickHandler}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChalkboardTeacher />
                        {t("Instructor")}
                      </span>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink to="/Instructor/BootcampManagement" onClick={ClickHandler}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaGraduationCap />
                        {t("Bootcamps")}
                      </span>
                    </NavLink>
                  </ListItem>
                </>
              )}
              
              {/* Supervisor Menu Items */}
              {authState.role && authState.role.includes("Supervisor") && (
                <>
                  <ListItem>
                    <NavLink to="/TeacherApplications" onClick={ClickHandler}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChalkboardTeacher />
                        {t("Instructive Applications")}
                      </span>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink to="/Supervisor/Evaluatecourses" onClick={ClickHandler}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaGraduationCap />
                        {t("Evaluate Courses")}
                      </span>
                    </NavLink>
                  </ListItem>
                </>
              )}
              
              <div className="menu-divider"></div>
              
              <ListItem>
                <p onClick={handleLogout} className="logout-link">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <FaSignOutAlt />
                    {t("Logout")}
                  </span>
                </p>
              </ListItem>
            </Fragment>
          ) : (
            <Fragment>
              <ListItem>
                <NavLink to="/login" onClick={ClickHandler} className="login-link">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <FaSignInAlt />
                    {t("Sign In")}
                  </span>
                </NavLink>
              </ListItem>
              <ListItem>
                <NavLink to="/register" onClick={ClickHandler} className="register-link">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <FaUserPlus />
                    {t("Sign Up")}
                  </span>
                </NavLink>
              </ListItem>
            </Fragment>
          )}
          
          {/* Language Selection */}
          <div className="menu-divider"></div>
          <div style={{ padding: '10px 20px' }}>
            <p style={{ color: '#fff', marginBottom: '10px' }}>{t("Select Language")}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              <button onClick={() => changeLanguage("tr")} className="lang-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>Türkçe</button>
              <button onClick={() => changeLanguage("en")} className="lang-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>English</button>
              <button onClick={() => changeLanguage("de")} className="lang-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>Deutsch</button>
              <button onClick={() => changeLanguage("ru")} className="lang-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>Русский</button>
              <button onClick={() => changeLanguage("hi")} className="lang-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>हिंदी</button>
            </div>
          </div>
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
