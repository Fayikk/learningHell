import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/logo-s2.svg";
import { useTranslation } from "react-i18next";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const Footer = (props) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <footer className="wpo-site-footer">
      <div className="wpo-upper-footer">
        <div className="container">
          <div className="row">
            <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
              <div className="widget about-widget">
                <div className="logo widget-title">
                  <Link
                    onClick={ClickHandler}
                    className="navbar-brand"
                    to="/home"
                  >
                    <img src={Logo} alt="" />
                  </Link>
                </div>
                <p>
                  {t(
                    "Mattis inelit neque quis donec eleifnd amet. Amet sed et cursus eu euismod. Egestas in morbi tristique ornare vulputate vitae enim."
                  )}
                </p>
                <div className="social">
                  <ul>
                    <li>
                      <Link onClick={ClickHandler} to="/">
                        <i className="ti-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/">
                        <i className="ti-twitter-alt"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/">
                        <i className="ti-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/">
                        <i className="ti-google"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3>{t("Quick Links")}</h3>
                </div>
                <ul>
                  <li>
                    <Link onClick={ClickHandler} to="/home">
                      {t("Home")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/about">
                      {t("About Us")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/teacher">
                      {t("Teachers")}
                    </Link>
                  </li>
               
                </ul>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
              <div className="widget link-widget s2">
                <div className="widget-title">
                  <h3>{t("Useful Links")}</h3>
                </div>
                <ul>
                  <li>
                    <Link onClick={ClickHandler} to="/contact">
                      {t("Contact Us")}
                    </Link>
                  </li>
                  {/* <li>
                    <Link onClick={ClickHandler} to="/register">
                      {t("Sign Up")}
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
              <div className="widget wpo-contact-widget">
                <div className="widget-title">
                  <h3>{t("Contact Us")}</h3>
                </div>
                <div className="contact-ft">
                  <ul>
                    <li>
                      <i className="fi flaticon-email"></i>mail@learninghell.com
                    </li>
                    <li>
                      <i className="fi flaticon-phone-call"></i>(+90) 531-014-9046{" "}
                      <br />
                      (+90) 531-306-2567
                    </li>
                    <li>
                      <i className="fi flaticon-placeholder"></i>Türkiye <br />{" "}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wpo-lower-footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col col-lg-6 col-md-12 col-12">
              <ul>
                <li>
                  &copy; 2024{" "}
                  <Link onClick={ClickHandler} to="/">
                    LearningHell - LH
                  </Link>
                  . {t("All rights reserved")} .
                </li>
              </ul>
            </div>
            <div className="col col-lg-6 col-md-12 col-12">
              <div className="link">
                <ul>
                  <li>
                    <Link onClick={ClickHandler} to="/privacy">
                      {t("Privacy & Policy")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/terms">
                      {t("Terms")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/about">
                      {t("About Us")}
                    </Link>
                  </li>
                
                  {/* <li>
                    <Link onClick={ClickHandler} to="/faq">
                      {t("FAQ")}
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
