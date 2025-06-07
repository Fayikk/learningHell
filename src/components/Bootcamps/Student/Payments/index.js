import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import Navbar from '../../../Navbar/Navbar';
import Footer from '../../../footer/Footer';
import '../styles.css';

// Success Icon as SVG component
const SuccessCheckmarkIcon = () => (
  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

// Calendar Icon
const CalendarIcon = () => (
  <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
  </svg>
);

// Location Icon
const LocationIcon = () => (
  <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
  </svg>
);

// Email Icon
const EmailIcon = () => (
  <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// User Icon
const UserIcon = () => (
  <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const PaymentSuccess = () => {
    
    const [orderDetails, setOrderDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [bootcampDetails, setBootcampDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // In a real scenario, you might want to fetch the order details from the server
    // or get them from the location state if they were passed during redirect
    // For now, we'll use mock data
    
    // Check if order details are passed in location state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      setUserDetails(location.state.userDetails);
      setBootcampDetails(location.state.bootcampDetails);
    } 
    
    // You might want to update some analytics or notify your backend
    // about the successful payment page visit
  }, [location]);

  // Facebook Pixel tracking code for purchase event
  useEffect(() => {
    console.log('Facebook Pixel tracking code executed');
    // Check if fbq is available in the global window object
    // Execute the Facebook Pixel tracking when component mounts
    if (typeof window !== 'undefined' && window.fbq) {
      // Replace 'YOUR_PIXEL_ID' with your actual Facebook Pixel ID
      console.log('Facebook Pixel ID:', 'YOUR_PIXEL_ID');
      window.fbq('track', 'Purchase', {
        currency: '22500',
      });
      console.log('Facebook Pixel Purchase event triggered');
    }
  }, []);

  // Format dates to readable strings
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };


  console.log("trigger user details", userDetails)
    console.log("trigger bootcamp details", bootcampDetails)
    console.log("trigger order details", orderDetails)



  // Format price with thousand separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
      .format(price)
      .replace('₺', '') + ' TL';
  };

  return (
    <>
      <Navbar />
      <div className="payment-success-container">
        <div className="success-card">
          <div className="success-icon-container">
            <SuccessCheckmarkIcon />
          </div>
          
          <h1 className="success-title">Ödeme Başarılı!</h1>
          <p className="success-message">
            Bootcamp kaydınız başarıyla tamamlandı. Aşağıda sipariş detaylarınızı bulabilirsiniz.
          </p>
          
          <div className="order-summary">
            <div className="order-header">
              <h2>Sipariş Özeti</h2>
              <span className="order-number">Sipariş No: {orderDetails && typeof orderDetails === 'object' ? orderDetails.orderId : ""}</span>
            </div>
            
            <div className="order-details-grid">
              <div className="bootcamp-info-section">
                <h3>Bootcamp Bilgileri</h3>
                
                {/* <div className="bootcamp-detail-card">
                  <img
                    src={bootcampDetails && bootcampDetails.thumbnail_Url }
                    alt={bootcampDetails && bootcampDetails.title}
                    className="bootcamp-thumbnail"
                  />
                  <div className="bootcamp-details">
                    <h4>{bootcampDetails &&bootcampDetails.title}</h4>
                    <div className="bootcamp-info-item">
                      <CalendarIcon />
                      <span>
                        {formatDate(bootcampDetails &&bootcampDetails.start_Date)} - {formatDate(bootcampDetails &&bootcampDetails.end_Date)}
                      </span>
                    </div>
                    <div className="bootcamp-info-item">
                      <LocationIcon />
                      <span>Online</span>
                    </div>
                  </div>
                </div> */}
              </div>
              
              {/* <div className="customer-info-section">
                <h3>Müşteri Bilgileri</h3>
                
                <div className="customer-details">
                  <div className="info-item">
                    <UserIcon />
                    <span>{userDetails.userName}</span>
                  </div>
                  <div className="info-item">
                    <EmailIcon />
                    <span>{userDetails.email}</span>
                  </div>
                </div>
              </div> */}
            </div>
            
            {/* <div className="payment-info-section">
              <h3>Ödeme Bilgileri</h3>
              <div className="payment-details">
                <div className="payment-row">
                  <span>Sipariş Tarihi:</span>
                  <span>{formatDate(orderDetails.orderDate)}</span>
                </div>
                <div className="payment-row total">
                  <span>Toplam Ödenen Tutar:</span>
                  <span>{formatPrice(bootcampDetails &&bootcampDetails.price)}</span>
                </div>
              </div>
            </div> */}
          </div>
          
          <div className="next-steps">
            <h3>Sonraki Adımlar</h3>
            <ol className="steps-list">
              <li>
                <span className="step-number">1</span>
                <div className="step-content">
                  <strong>E-postanızı kontrol edin</strong>
                  <p>Sipariş onayınız ve bootcamp ile ilgili detaylı bilgiler e-posta adresinize gönderildi.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div className="step-content">
                  <strong>Kullanıcı hesabınızı düzenleyin</strong>
                  <p>Kişisel bilgilerinizi güncelleyerek bootcamp deneyiminizi kişiselleştirin.</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div className="step-content">
                  <strong>Bootcamp başlangıç tarihini not edin</strong>
                  <p>Bootcamp başlangıç tarihinden önce gerekli hazırlıkları tamamlayın.</p>
                </div>
              </li>
              <li>
                <span className="step-number">4</span>
                <div className="step-content">
                  <strong>Bizimle İletişime Geçin</strong>
                  <p>education@learninghell.com mail adresi üzerinden bizimle iletişime geçin!</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div className="action-buttons">
            <Link to="/Student/Bootcamps" className="primary-button">
              Bootcamp Listesine Dön
            </Link>
            <Link to="/dashboard" className="secondary-button">
              Kullanıcı Paneline Git
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
