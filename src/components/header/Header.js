import './Styles/Header.css'
import './Styles/ModernHeader.css'
import React, { useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "../MobileMenu/MobileMenu";
import Logo from "../../images/logo/LH.png";
import HeaderTopbar from "../HeaderTopbar/HeaderTopbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { InitialState, setLoggedInUser } from "../../store/reducers/authSlice";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { CiShoppingCart } from "react-icons/ci";
import { TbWorld } from "react-icons/tb";
import { FaLock, FaUserCircle, FaSignOutAlt, FaChalkboardTeacher, FaGraduationCap, FaTags, FaNewspaper, FaCog, FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import OpenCage from "../../Environments/OpenCage";
import { setLocationCountry } from "../../store/reducers/locationSlice";
import Cookies from "js-cookie";
import { useGetShoppingCartQuery } from "../../api/shoppingCartApi";
import IsLoading from "../Loading/IsLoading";
import { cartStateUpdate } from "../../store/reducers/cartSlice";
import { ThemeProvider } from "../../main-component/Extensions/Theme/ThemeProvider";
import ThemeToggle from "../../main-component/Extensions/Theme/ThemeToggle";
import { useRef } from 'react';
const Header = ({ props, onAuthStateChange }) => {
  const [menuActive, setMenuState] = useState(false);
  const authenticationState = useSelector((state) => state.authStore);
  const cartCounter = useSelector((state) => state.cartStore.cartCounter);
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocalizationDropdown, setShowLocalizationDropdown] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");
  const {data,isLoading} = useGetShoppingCartQuery();

  // useEffect(() => {
  //   if (data && data.result) {
  //     console.log("trigger data result",data.result)
  //     Dispatch(cartStateUpdate(data.result.courses.length));
  //   }
  // }, [data]);

  useEffect(()=>{
    if (data) {
      if (data.result != null) {
        Dispatch(cartStateUpdate(data.result.courses.length))

      }
      else {
    Dispatch(cartStateUpdate(0))

      }
     
    } 


  },[data])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  const timerRef = useRef(null);

  const handleMouseDropdownEnter = () => {
    clearTimeout(timerRef.current); 
    setShowLocalizationDropdown(true); 
  };

  const handleMouseDropdownLeave = () => {
    timerRef.current = setTimeout(() => setShowLocalizationDropdown(false), 200); 
  };
  useEffect(() => {
    if (location) {
      const fetchCountry = async () => {
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&language=en&key=${OpenCage.apiKey}`
          );
          const country = response.data.results[0].components.country;
          setCountry(country);
        } catch (error) {
          setError("Error fetching country information");
        }
      };

      fetchCountry();
    }
  }, [location]);

  useEffect(() => {
    if (country) {
      Cookies.set("LocationData", country, { sameSite: "None", secure: true });
      Dispatch(setLocationCountry(country));
    }
  }, [country]);

  const handleMouseEnter = (params) => {
    if (params === "localization") {
      setShowLocalizationDropdown(true);
    } else {
      setShowDropdown(true);
    }
  };

  const handleMouseLeave = (params) => {
    if (params === "localization") {
      setShowLocalizationDropdown(false);
    } else {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    onAuthStateChange(authenticationState);
  }, [authenticationState]);

  useEffect(() => {
    var currentLanguage = localStorage.getItem("language");
    changeLanguage(currentLanguage);
  }, []);

  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  const changeLanguage = (lng) => {
    localStorage.setItem("language", lng);
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    Dispatch(setLoggedInUser({ ...InitialState }));
    Navigate("/home");
  };

  if (isLoading) {
    return (
      <IsLoading></IsLoading>
    )
  }
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  return (
    <header id="header">
      <HeaderTopbar />
      
      <div className="modern-header">
        <nav className="modern-navigation navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="row align-items-center w-100">              {/* Mobile Menu */}
              <div className="col-lg-3 col-md-4 col-3 d-lg-none dl-block">
                <div className="mobail-menu mobile-menu-modern">
                  <MobileMenu />
                </div>
              </div>
              
              {/* Logo */}
              <div className="col-lg-3 col-md-4 col-6">
                <div className="brand-logo">
                  <Link
                    onClick={ClickHandler}
                    className="navbar-brand"
                    to="/home"
                  >
                    <img src={Logo} alt="logo" />
                  </Link>
                </div>
              </div>
              
              {/* Main Menu */}
              <div className="col-lg-6 col-md-1 col-1">
                <div id="navbar" className="navbar-collapse">
                 
                  
                  {/* Desktop Menu */}
                  <ul className="modern-menu navbar-nav">
                    {/* Courses with Dropdown */}
                    <li className="modern-menu-item modern-dropdown">
                      <Link onClick={ClickHandler} to="/" className="modern-menu-link">
                        <FaBook />
                        {t("Courses")}
                      </Link>
                      <ul className="modern-dropdown-menu">
                        <li className="modern-dropdown-item">
                          <Link onClick={ClickHandler} to="/course-2" className="modern-dropdown-link">
                            {t("Categories")}
                          </Link>
                        </li>
                      </ul>
                    </li>
                    
                    {/* Bootcamps */}
                    <li className="modern-menu-item">
                      <Link onClick={ClickHandler} to="/Student/Bootcamps" className="modern-menu-link">
                        <FaChalkboardTeacher />
                        {t("Bootcamps")}
                      </Link>
                    </li>
                    
                    {/* Free Content */}
                    <li className="modern-menu-item">
                      <Link onClick={ClickHandler} to="/Free/Content" className="modern-menu-link">
                        <FaGraduationCap />
                        {t("Free Content")}
                      </Link>
                    </li>
                    
                    {/* Blog */}
                    <li className="modern-menu-item">
                      <Link onClick={ClickHandler} to="/blogs" className="modern-menu-link">
                        <FaNewspaper />
                        {t("Blog")}
                      </Link>
                    </li>
                    
                    {/* Become Teacher (Conditional) */}
                    {authenticationState.role && authenticationState.role.includes("Instructor") ? "" : (
                      <li className="modern-menu-item">
                        <Link onClick={ClickHandler} to="/become-teacher" className="modern-menu-link">
                          <FaChalkboardTeacher />
                          {t("Become Teacher")}
                        </Link>
                      </li>
                    )}
                    
                    {/* Cart */}
                    <li className="modern-menu-item">
                      <Link onClick={ClickHandler} to="/cart" className="modern-menu-link">
                        <CiShoppingCart />
                        <span className="cart-counter">{cartCounter}</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Header Right Section */}
              <div className="col-lg-3 col-md-3 col-2">
                <div className="modern-header-right">
                
                  {/* Not Logged In */}
                  {authenticationState.userName === "" ? (
                    <div className="auth-buttons">
                      <Link
                        onClick={ClickHandler}
                        className="btn-sign-in"
                        to="/login"
                      >
                        <span>{t("Sign In")}</span>
                      </Link>
                      <Link
                        onClick={ClickHandler}
                        className="btn-sign-up"
                        to="/register"
                      >
                        <span>{t("Sign Up")}</span>
                      </Link>
                    </div>
                  ) : (
                    /* Logged In */
                    <>
                      {/* My Bootcamps Button */}
                      <Link 
                        to="/Dashboard" 
                        className="bootcamp-button"
                      >
                        <i className="fi flaticon-online-learning"></i>
                        {t("My Bootcamps")}
                      </Link>
                      
                      {/* User Menu */}
                      <div className="user-menu">
                        <div className="user-avatar">
                          {authenticationState.userName.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* User Dropdown */}
                        <div className="user-dropdown">
                          <Link to="/MyCourse" className="user-dropdown-item">
                            <FaBook />
                            {t("My Courses")}
                          </Link>
                          
                          {/* Instructor Options */}
                          {authenticationState.role &&
                          authenticationState.role.includes("Instructor") && (
                            <>
                              <Link to="/Instructor" className="user-dropdown-item">
                                <FaChalkboardTeacher />
                                {t("Instructor")}
                              </Link>
                              <Link to="/Instructor/BootcampManagement" className="user-dropdown-item">
                                <FaGraduationCap />
                                {t("Bootcamps")}
                              </Link>
                              <Link to="/admin/tags" className="user-dropdown-item">
                                <FaTags />
                                {t("Add Tags")}
                              </Link>
                              <Link to="/admin/news" className="user-dropdown-item">
                                <FaNewspaper />
                                {t("Add News")}
                              </Link>
                            </>
                          )}
                          
                          {/* Supervisor Options */}
                          {authenticationState.role &&
                          authenticationState.role.includes("Supervisor") && (
                            <>
                              <Link to="/TeacherApplications" className="user-dropdown-item">
                                <FaChalkboardTeacher />
                                {t("Instructive Applications")}
                              </Link>
                              <Link to="/Supervisor/Evaluatecourses" className="user-dropdown-item">
                                <FaGraduationCap />
                                {t("Evaluate Courses")}
                              </Link>
                            </>
                          )}
                          
                          <div className="user-dropdown-divider"></div>
                          
                          <Link to="/MyAccount" className="user-dropdown-item">
                            <FaCog />
                            {t("My Account")}
                          </Link>
                          
                          <Link onClick={logout} to="/home" className="user-dropdown-item logout-button">
                            <FaSignOutAlt />
                            {t("Logout")}
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Language Selector */}
                  <div className="language-selector">
                    <button className="language-button">
                      <TbWorld />
                    </button>
                    <div className="language-dropdown">
                      <div className="language-option" onClick={() => changeLanguage("tr")}>
                        <span>Türkçe</span>
                      </div>
                      <div className="language-option" onClick={() => changeLanguage("en")}>
                        <span>English</span>
                      </div>
                      <div className="language-option" onClick={() => changeLanguage("de")}>
                        <span>Deutsch</span>
                      </div>
                      <div className="language-option" onClick={() => changeLanguage("ru")}>
                        <span>РУССКИЙ</span>
                      </div>
                      <div className="language-option" onClick={() => changeLanguage("hi")}>
                        <span>हिंदी</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

// <li className="menu-item-has-children">
// <Link onClick={ClickHandler} to="/">Pages</Link>
// <ul className="sub-menu">
//     {/* <li><Link onClick={ClickHandler} to="/lesson">Lesson</Link></li> */}
//     <li><Link onClick={ClickHandler} to="/gallery">Gallery</Link></li>
//     <li><Link onClick={ClickHandler} to="/testimonial">Testimonial</Link></li>
//     <li><Link onClick={ClickHandler} to="/teacher">Teachers</Link></li>
//     <li><Link onClick={ClickHandler} to="/team-single/Courtney-Henry">Teacher Single</Link></li>
//     <li><Link onClick={ClickHandler} to="/become-teacher">Become Teacher</Link></li>
//     <li><Link onClick={ClickHandler} to="/faq">FAQ</Link></li>
//     <li><Link onClick={ClickHandler} to="/404">404 Error</Link></li>
// </ul>
// </li>
