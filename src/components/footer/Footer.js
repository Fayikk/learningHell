import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/logo/LH.png";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MesafeliSatis from '../../agrements/MesafeliSatis'
import TeslimatVeIade from '../../agrements/TeslimatVeIade';
import GizlilikPolitikasi from '../../agrements/GizlilikPolitikasi';
import Button from "@mui/material/Button";
import { useState } from "react";
import { Grid } from "@mui/material";
import visa from '../../images/icon/visa.png';
import mastercard from '../../images/icon/mastercard.png';
import iyzico from '../../images/icon/iyzico_ile_ode_colored_horizontal.png'
import './Styles/Footer.css'
import Etbis from "../../Extensions/Etbis";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const cardType = [
  {
      title: 'visa',
      img: visa
  },
  {
      title: 'mastercard',
      img: mastercard
  },
  {
      title: 'iyzico',
      img: iyzico
  },
];

const Footer = (props) => {
  const { t, i18n } = useTranslation(); 
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isRefundAgreementOpen, setIsRefundAgreementOpen] = useState(false);
  const [isSecurityAgreementOpen, setIsSecurityAgreementOpen] = useState(false);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const [forms, setForms] = React.useState({
    cupon_key: '',
    payment_method: 'cash',
    card_type: '',
    card_holder: '',
    card_number: '',
    cvv: '',
    expire_date: '',
  });

  const handleOpenAgreement = () => {
    setIsAgreementOpen(true);
  };

  const handleCloseAgreement = () => {
    setIsAgreementOpen(false);
  };

  const handleCancelOpenAgreement = () => {
    setIsRefundAgreementOpen(true);
  };

  const handleCancelCloseAgreement = () => {
    setIsRefundAgreementOpen(false);
  };

  const handleSecurityOpenAgreement = () => {
    setIsSecurityAgreementOpen(true);
  };

  const handleSecurityCloseAgreement = () => {
    setIsSecurityAgreementOpen(false);
  };

  return (
    <footer className="wpo-site-footer">
      <div className='text text-center'>
        {/* Dialog Bileşenleri */}
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
            <Button onClick={handleCloseAgreement} color="primary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isSecurityAgreementOpen}
          onClose={handleSecurityCloseAgreement}
          aria-labelledby="agreement-dialog-title"
          aria-describedby="agreement-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="agreement-dialog-title">Gizlilik Politikası</DialogTitle>
          <DialogContent dividers>
            <GizlilikPolitikasi />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSecurityCloseAgreement} color="primary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isRefundAgreementOpen}
          onClose={handleCancelCloseAgreement}
          aria-labelledby="agreement-dialog-title"
          aria-describedby="agreement-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="agreement-dialog-title">Teslimat ve İade</DialogTitle>
          <DialogContent dividers>
            <TeslimatVeIade />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCloseAgreement} color="primary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    
      <div className="wpo-upper-footer">
        <div className="container">
          <div className="row footer-row">
            {/* Logo ve Sosyal Medya */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget about-widget">
                <div className="logo widget-title">
                  <Link onClick={ClickHandler} className="navbar-brand" to="/home">
                    <img src={Logo} alt="LearningHell Logo" className="footer-logo" />
                  </Link>
                </div>

                <p className="footer-description">
                  {t("Limitless learning, limitless opportunities. Join us today!")}
                </p>
              </div>
            </div>
    <div className="col-lg-3 col-md-6 col-sm-12">
    <iframe
  src="/Etbis/etbis.html"
  title="ETBIS"
  style={{ width: 160, height: 180, border: "none", background: "transparent" }}
/>
    </div>
            {/* Quick Links */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3 className="footer-heading">{t("Quick Links")}</h3>
                </div>
                <ul className="footer-links">
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
                    <Button onClick={handleOpenAgreement} className="footer-btn-link">
                      <i className="ti-file"></i> <span>{t("Mesafeli Satış Sözleşmesi")}</span>
                    </Button>
                  </li>
                  <li className="footer-link-item">
                    <Button onClick={handleSecurityOpenAgreement} className="footer-btn-link">
                      <i className="ti-lock"></i> <span>{t("Gizlilik Politikası")}</span>
                    </Button>
                  </li>
                  <li className="footer-link-item">
                    <Button onClick={handleCancelOpenAgreement} className="footer-btn-link">
                      <i className="ti-package"></i> <span>{t("Teslimat Ve İade")}</span>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
    
            {/* Contact */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget wpo-contact-widget">
                <div className="widget-title">
                  <h3 className="footer-heading">{t("Contact Us")}</h3>
                </div>
                <div className="contact-ft">
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
            </div>
          </div>
    
          {/* Payment Methods */}
          <div className="payment-methods-section">
            <h4 className="payment-heading">{t("Ödeme Yöntemleri")}</h4>
            <div className="payment-icons-container">
              {cardType.map((item, i) => (
                <div key={i} className="payment-icon-wrapper">
                  <img src={item.img} alt={item.title} className="payment-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
      <div className="wpo-lower-footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="copyright">
                &copy; {new Date().getFullYear()} {" "}
                <Link onClick={ClickHandler} to="/" className="copyright-link">
                  Teleferic ltd şti - LH
                </Link>
                . {t("All rights reserved")}
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="link">
                {/* Links if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;