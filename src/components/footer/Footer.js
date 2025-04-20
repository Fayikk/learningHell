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
    // ...existing code...
    payment_method: 'cash',
    card_type: '',
    // ...existing code...
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
        {/* Dialog Bileşenleriniz */}
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
            {/* İlk Kolon */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget about-widget">
                <div className="logo widget-title">
                  <Link onClick={ClickHandler} className="navbar-brand" to="/home">
                    <img src={Logo} alt="LearningHell Logo" className="footer-logo" />
                  </Link>
                </div>
                <p className="footer-description">
                  {t(
                   
                  )}
                </p>
                <div className="social">
                  <ul className="social-icons">
                    <li>
                      <Link onClick={ClickHandler} to="/" className="social-icon">
                        <i className="ti-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/" className="social-icon">
                        <i className="ti-twitter-alt"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/" className="social-icon">
                        <i className="ti-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} to="/" className="social-icon">
                        <i className="ti-google"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
    
            {/* İkinci Kolon */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3 className="footer-heading">{t("Quick Links")}</h3>
                </div>
                <ul className="footer-links">
                  <li>
                    <Link onClick={ClickHandler} to="/home" className="footer-link">
                      <i className="ti-angle-right"></i> {t("Home")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/about" className="footer-link">
                      <i className="ti-angle-right"></i> {t("About Us")}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} to="/teacher" className="footer-link">
                      <i className="ti-angle-right"></i> {t("Teachers")}
                    </Link>
                  </li>
                  <li>
                    <Button onClick={handleOpenAgreement} className="footer-btn-link">
                      <i className="ti-file"></i> {t("Mesafeli Satış Sözleşmesi")}
                    </Button>
                  </li>
                  <li>
                    <Button onClick={handleSecurityOpenAgreement} className="footer-btn-link">
                      <i className="ti-lock"></i> {t("Gizlilik Politikası")}
                    </Button>
                  </li>
                  <li>
                    <Button onClick={handleCancelOpenAgreement} className="footer-btn-link">
                      <i className="ti-package"></i> {t("Teslimat Ve İade")}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
    
            {/* Üçüncü Kolon */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget link-widget s2">
                <div className="widget-title">
                  <h3 className="footer-heading">{t("Useful Links")}</h3>
                </div>
                <ul className="footer-links">
                  <li>
                    <Link onClick={ClickHandler} to="/contact" className="footer-link">
                      <i className="ti-angle-right"></i> {t("Contact Us")}
                    </Link>
                  </li>
                  {/* Diğer linkler */}
                </ul>
              </div>
            </div>
    
            {/* Dördüncü Kolon */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="widget wpo-contact-widget">
                <div className="widget-title">
                  <h3 className="footer-heading">{t("Contact Us")}</h3>
                </div>
                <div className="contact-ft">
                  <ul className="contact-list">
                    <li className="contact-item">
                      <i className="fi flaticon-email"></i>
                      <span className="contact-text">mail@learninghell.com</span>
                    </li>
                    <li className="contact-item">
                      <i className="fi flaticon-email"></i>
                      <span className="contact-text">education@learninghell.com</span>
                    </li>
                    <li className="contact-item">
                      <i className="fi flaticon-placeholder"></i>
                      <span className="contact-text">Türkiye</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
    
          {/* Payment Methods */}
          <div className="payment-methods">
            <h4>Ödeme Yöntemleri</h4>
            <div className="payment-icons">
              {cardType.map((item, i) => (
                <div key={i} className="payment-icon">
                  <img src={item.img} alt={item.title} />
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