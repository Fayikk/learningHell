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
import GizlilikPolitikasi from '../../agrements/GizlilikPolitikasi';import Button from "@mui/material/Button";
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
    // fname: '',
    // lname: '',
    // country: '',
    // dristrict: '',
    // identityNumber:'',
    // address: '',
    // post_code: '',
    // email: '',
    // phone: '',
    // note: '',

    payment_method: 'cash',
    card_type: '',

    // fname2: '',
    // lname2: '',
    // country2: '',
    // dristrict2: '',
    // address2: '',
    // post_code2: '',
    // email2: '',
    // phone2: '',

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
        <div className="row">
          {/* İlk Kolon */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget about-widget">
              <div className="logo widget-title">
                <Link onClick={ClickHandler} className="navbar-brand" to="/home">
                  <img src={Logo} alt="LearningHell Logo" />
                </Link>
              </div>
              <p>
                {t(
                 
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
  
          {/* İkinci Kolon */}
          <div className="col-lg-3 col-md-6 col-sm-12">
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
                <li>
                  <Button onClick={handleOpenAgreement}>
                    {t("Mesafeli Satış Sözleşmesi")}
                  </Button>
                </li>
                <li>
                  <Button onClick={handleSecurityOpenAgreement}>
                    {t("Gizlilik Politikası")}
                  </Button>
                </li>
                <li>
                  <Button onClick={handleCancelOpenAgreement}>
                    {t("Teslimat Ve İade")}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Üçüncü Kolon */}
          <div className="col-lg-3 col-md-6 col-sm-12">
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
  
          {/* Dördüncü Kolon */}
          <div className="col-lg-3 col-md-6 col-sm-12">
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
                    <i className="fi flaticon-email"></i>education@learninghell.com
                  </li>
                  <li>
                    <i className="fi flaticon-phone-call"></i>(+90) 531-014-9046 <br />
                    (+90) 531-306-2567
                  </li>
                  <li>
                    <i className="fi flaticon-placeholder"></i>Türkiye <br />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  
        {/* Logo Konteyneri */}
        <div className="container-logo">
          <div className="logo-row">
            {cardType.map((item, i) => (
              <div
                key={i}
                className={`cardItem ${forms.card_type === item.title ? 'active' : ''}`}
                onClick={() => setForms({ ...forms, card_type: item.title })}
              >
                <img style={{width:"100%",height:"100%"}} src={item.img} alt={item.title} />
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
            <ul>
              <li>
                &copy; 2024{" "}
                <Link onClick={ClickHandler} to="/">
                  Teleferic ltd şti - LH
                </Link>
                . {t("All rights reserved")} .
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-12 col-12">
            <div className="link">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  
  );
};

export default Footer;



// <ul>
// <li>
//   <Link onClick={ClickHandler} to="/privacy">
//     {t("Privacy & Policy")}
//   </Link>
// </li>
// <li>
//   <Link onClick={ClickHandler} to="/terms">
//     {t("Terms")}
//   </Link>
// </li>
// <li>
//   <Link onClick={ClickHandler} to="/about">
//     {t("About Us")}
//   </Link>
// </li>
// <li>
//   <Link onClick={ClickHandler} to="/faq">
//     {t("FAQ")}
//   </Link>
// </li>
// </ul>