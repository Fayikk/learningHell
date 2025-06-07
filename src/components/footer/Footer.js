import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import Logo from "../../images/logo/LH.png";

// Component imports
import MesafeliSatis from '../../agrements/MesafeliSatis';
import TeslimatVeIade from '../../agrements/TeslimatVeIade';
import GizlilikPolitikasi from '../../agrements/GizlilikPolitikasi';

// CSS
import './Styles/Footer.css';

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const Footer = (props) => {
  const { t, i18n } = useTranslation();
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isRefundAgreementOpen, setIsRefundAgreementOpen] = useState(false);
  const [isSecurityAgreementOpen, setIsSecurityAgreementOpen] = useState(false);

  const handleOpenAgreement = () => setIsAgreementOpen(true);
  const handleCloseAgreement = () => setIsAgreementOpen(false);
  
  const handleCancelOpenAgreement = () => setIsRefundAgreementOpen(true);
  const handleCancelCloseAgreement = () => setIsRefundAgreementOpen(false);
  
  const handleSecurityOpenAgreement = () => setIsSecurityAgreementOpen(true);
  const handleSecurityCloseAgreement = () => setIsSecurityAgreementOpen(false);

  return (
    <footer className="modern-footer">
      {/* Dialogs */}
      <div className="dialog-container">
        <Dialog
          open={isAgreementOpen}
          onClose={handleCloseAgreement}
          aria-labelledby="agreement-dialog-title"
          aria-describedby="agreement-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="agreement-dialog-title">Mesafeli Satış Sözleşmesi</DialogTitle>
          <DialogContent dividers>
            <MesafeliSatis />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAgreement} color="primary" variant="contained">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isSecurityAgreementOpen}
          onClose={handleSecurityCloseAgreement}
          aria-labelledby="security-dialog-title"
          aria-describedby="security-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="security-dialog-title">Gizlilik Politikası</DialogTitle>
          <DialogContent dividers>
            <GizlilikPolitikasi />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSecurityCloseAgreement} color="primary" variant="contained">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isRefundAgreementOpen}
          onClose={handleCancelCloseAgreement}
          aria-labelledby="refund-dialog-title"
          aria-describedby="refund-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="refund-dialog-title">Teslimat ve İade</DialogTitle>
          <DialogContent dividers>
            <TeslimatVeIade />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCloseAgreement} color="primary" variant="contained">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Logo and Tagline */}
            <div className="footer-branding">
              <div className="footer-logo-container">
                <Link onClick={ClickHandler} to="/home" className="footer-logo-link">
                  <img src={props.Logo || Logo} alt="LearningHell Logo" className="footer-logo" />
                </Link>
              </div>
              <p className="footer-tagline">
                {t("Limitless learning, limitless opportunities. Join us today!")}
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon"><i className="ti-facebook"></i></a>
                <a href="#" className="social-icon"><i className="ti-twitter"></i></a>
                <a href="#" className="social-icon"><i className="ti-instagram"></i></a>
                <a href="#" className="social-icon"><i className="ti-linkedin"></i></a>
              </div>
            </div>

            {/* ETBIS */}
            <div className="footer-etbis">
              <iframe
                src="/Etbis/etbis.html"
                title="ETBIS"
                style={{ width: 160, height: 180, border: "none", background: "transparent" }}
              />
            </div>

            {/* Quick Links */}
            <div className="footer-links-container">
              <h3 className="footer-heading">{t("Quick Links")}</h3>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <Link onClick={ClickHandler} to="/home" className="footer-link">
                    <i className="ti-angle-right"></i> <span>{t("Home")}</span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link onClick={ClickHandler} to="/about" className="footer-link">
                    <i className="ti-angle-right"></i> <span>{t("About Us")}</span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link onClick={ClickHandler} to="/teacher" className="footer-link">
                    <i className="ti-angle-right"></i> <span>{t("Teachers")}</span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <button onClick={handleOpenAgreement} className="footer-btn-link">
                    <i className="ti-file"></i> <span>{t("Mesafeli Satış Sözleşmesi")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <button onClick={handleSecurityOpenAgreement} className="footer-btn-link">
                    <i className="ti-lock"></i> <span>{t("Gizlilik Politikası")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <button onClick={handleCancelOpenAgreement} className="footer-btn-link">
                    <i className="ti-package"></i> <span>{t("Teslimat Ve İade")}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-contact">
              <h3 className="footer-heading">{t("Contact Us")}</h3>
              <ul className="contact-list">
                <li className="contact-item">
                  <div className="contact-icon">
                    <i className="fi flaticon-email"></i>
                  </div>
                  <div className="contact-text">mail@learninghell.com</div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <i className="fi flaticon-email"></i>
                  </div>
                  <div className="contact-text">education@learninghell.com</div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <i className="fi flaticon-placeholder"></i>
                  </div>
                  <div className="contact-text">Türkiye</div>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-section">
            <h4 className="payment-heading">{t("Ödeme Yöntemleri")}</h4>
            <div className="payment-icons">
              {props.cardType && props.cardType.map((item, i) => (
                <div key={i} className="payment-icon">
                  <img src={item.img} alt={item.title} className="payment-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="footer-copyright">
        <div className="container">
          <div className="copyright-content">
            <div className="copyright-text">
              &copy; {new Date().getFullYear()}{" "}
              <Link onClick={ClickHandler} to="/" className="copyright-link">
                Teleferic ltd şti - LH
              </Link>
              . {t("All rights reserved")}
            </div>
            <div className="footer-extra-links">
              {/* Additional links if needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;