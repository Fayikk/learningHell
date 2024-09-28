import React, { useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "../MobileMenu/MobileMenu";
import Logo from "../../images/logo.svg";
import HeaderTopbar from "../HeaderTopbar/HeaderTopbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { InitialState, setLoggedInUser } from "../../store/reducers/authSlice";
import { useSelector } from "react-redux";
import {  Dropdown } from "react-bootstrap";
import { CiShoppingCart } from "react-icons/ci";
import { TbWorld } from "react-icons/tb";
import { FaLock } from "react-icons/fa";
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
const Header = ({ props, onAuthStateChange }) => {
  const [menuActive, setMenuState] = useState(false);
  const authenticationState = useSelector((state) => state.authStore);
  const cartCounter = useSelector((state) => state.cartStore.cartCounter);
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocalizationDropdown, setShowLocalizationDropdown] =
    useState(false);
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
      
      <div className={`wpo-site-header`}>
        
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            
            <div className="row align-items-center">
              
              <div className="col-lg-3 col-md-4 col-3 d-lg-none dl-block">
                
                <div className="mobail-menu">
                  <MobileMenu />
                </div>
                
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <div className="navbar-header">
                  <Link
                    onClick={ClickHandler}
                    className="navbar-brand"
                    to="/home"
                  >
                    <img src={Logo} alt="logo" />
                  </Link>
                </div>
              </div>
              
              <div className="col-lg-6 col-md-1 col-1">
              <div id="navbar" className="navbar-collapse">
  <button className="menu-close">
    <i className="ti-close"></i>
  </button>
  <ul className="nav navbar-nav">
  <li className="menu-item">
    <Link onClick={ClickHandler} to="/" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      {t("Courses")}
    </Link>
    <ul className="sub-menu">
      <li>
        <Link onClick={ClickHandler} to="/course-2" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {t("Categories")}
        </Link>
      </li>
    </ul>
  </li>
  
  <li className="menu-item">
    <Link onClick={ClickHandler} to="" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <FaLock /> {t("Collections")}
    </Link>
  </li>
  
  <li className="menu-item">
    <Link onClick={ClickHandler} to="" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <FaLock /> {t("Pair Working Rooms")}
    </Link>
  </li>
  
  {authenticationState.role && authenticationState.role.includes("Instructor") ? "" : (
    <li className="menu-item">
      <Link onClick={ClickHandler} to="/become-teacher" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {t("Become Teacher")}
      </Link>
    </li>
  )}
  
  <li className="menu-item">
    <Link onClick={ClickHandler} to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <CiShoppingCart /> ({cartCounter})
    </Link>
  </li>
</ul>

</div>

              </div>
              <div className="col-lg-3 col-md-3 col-2">
                <div className="header-right">
                  {/* <div className="header-search-form-wrapper">
                                        <div className="cart-search-contact">
                                            <button onClick={() => setMenuState(!menuActive)} className="search-toggle-btn"><i
                                                className={`fi ti-search ${menuActive ? "ti-close" : "fi "}`}></i></button>
                                            <div className={`header-search-form ${menuActive ? "header-search-content-toggle" : ""}`}>
                                                <form onSubmit={SubmitHandler}>
                                                    <div>
                                                        <input type="text" className="form-control"
                                                            placeholder="Search here..." />
                                                        <button type="submit"><i
                                                            className="fi flaticon-search"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div> */}
                  <div className="close-form">
                  <div>
                    <ThemeProvider>
                      <ThemeToggle></ThemeToggle>
                    </ThemeProvider>
                  </div>
                    {authenticationState.userName === "" ? (
                      <>
                        <Link
                          onClick={ClickHandler}
                          className="login"
                          to="/login"
                        >
                          <span className="text">{t("Sign In")}</span>
                          <span className="mobile">
                            <i className="fi flaticon-charity"></i>
                          </span>
                        </Link>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/register"
                          style={{outline:"none"}}
                        >
                          <span className="text">{t("Sign Up")}</span>
                          <span className="mobile">
                            <i className="fi flaticon-charity"></i>
                          </span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="ml-2">
                          <Dropdown
                            show={showDropdown}
                            onMouseEnter={() => handleMouseEnter()}
                            onMouseLeave={() => handleMouseLeave()}
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="dropdown-basic"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <a
                                className="theme-btn"
                                style={{ backgroundColor: "blueviolet" }}
                              >
                                {" "}
                                <span className="text">
                                  {" "}
                                  {authenticationState.userName}{" "}
                                </span>
                              </a>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ borderRadius: "20px" }}>
                              <Dropdown.Item as={Link} to="/MyCourse">
                                {t("My Courses")}
                              </Dropdown.Item>
                              {authenticationState.role &&
                              authenticationState.role.includes(
                                "Instructor"
                              ) ? (
                                <Dropdown.Item as={Link} to="/Instructor">
                                  {t("Instructor")}
                                </Dropdown.Item>
                              ) : (
                                ""
                              )}

                              {authenticationState.role &&
                              authenticationState.role.includes(
                                "Supervisor"
                              ) ? (
                                <>
                                  <Dropdown.Item
                                    as={Link}
                                    to="/TeacherApplications"
                                  >
                                    {t("Instructive Applications")}
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as={Link}
                                    to="/Supervisor/Evaluatecourses"
                                  >
                                    {t("Evaluate Courses")}
                                  </Dropdown.Item>
                                </>
                              ) : (
                                ""
                              )}

                              <Dropdown.Item as={Link} to="/MyAccount">
                                {t("My Account")}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        <div>
                          <Link
                            onClick={logout}
                            className="theme-btn"
                            to="/home"
                          >
                            <span className="text">{t("Logout")}</span>
                            <span className="mobile">
                              <i className="fi flaticon-charity"></i>
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                 
                  <div>
                    <Dropdown
                      show={showLocalizationDropdown}
                      onClick={() => handleMouseEnter("localization")}
                      onDoubleClick={() => handleMouseLeave("localization")}
                    >
                      <Dropdown.Toggle
                        variant="primary"
                        id="dropdown-basic"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <a
                          className="theme-btn"
                          style={{ backgroundColor: "green" }}
                        >
                          {" "}
                          <TbWorld></TbWorld>
                        </a>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ borderRadius: "20px" }}>
                        <Dropdown.Item onClick={() => changeLanguage("tr")}>
                          Türkçe
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => changeLanguage("en")}>
                          English
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => changeLanguage("de")}>
                          Deutsch
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => changeLanguage("ru")}>
                          РУССКИЙ
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => changeLanguage("hi")}>
                          हिंदी
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
