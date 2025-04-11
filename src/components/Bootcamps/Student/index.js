import React, { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/dateFormatter';
import './styles.css';
import { useGetAllBootcampsMutation } from '../../../api/bootcampApi';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../footer/Footer';
import { usePaymentBootcampCheckoutMutation, usePaymentCheckoutMutation } from '../../../api/paymentApi';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { payHub } from '../../../api/Base/payHubModel';
// SVG Icons as React components
const CalendarIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
  </svg>
);

// Other icon components remain unchanged
const LocationIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
  </svg>
);

const MoneyIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
  </svg>
);

const TimeIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
);

const ArrowForwardIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
  </svg>
);

const BadgeIcon = () => (
  <svg className="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

// Add a 3D Secure Popup component
const SecurePaymentPopup = ({ htmlContent, onClose }) => {
  return (
    <div className="secure-payment-overlay">
      <div className="secure-payment-popup">
        <div className="secure-payment-header">
          <h3>3D Secure Doğrulama</h3>
          <button className="secure-close-button" onClick={onClose}>×</button>
        </div>
        <div className="secure-payment-content">
          <iframe
            srcDoc={htmlContent}
            title="3D Secure Verification"
            className="secure-payment-iframe"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
          />
        </div>
      </div>
    </div>
  );
};

const StudentBootcampList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [createPayment] = usePaymentBootcampCheckoutMutation();
  const [hubConnection,setHubConnection] = useState();
  const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
    const [html, setHtml] = useState(null);

 

  
  // Add new state variables for form data and discount
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    couponCode: '',
    cardName: '',
    cardNumber: '',
    // expiryDate: '',//bunun expire month ve expire year olarak 2'ye ayrılması gerekiyor.
    expireMonth: '',
    expireYear: '',
    cvv: '',
    identityNumber: '', // For Turkish citizens
  });
  const [discount, setDiscount] = useState({
    applied: false,
    amount: 0,
    code: ''
  });
  const [expandedSection, setExpandedSection] = useState('personal'); // Track which section is expanded
  const pageSize = 6;
  
  const requestBody = {
    isSearch: true,
    pageIndex: currentPage,
    pageSize: pageSize,
    sortColumn: "Title",
    sortOrder: "desc",
    filters: { groupOp: "AND", rules: [] }
  };
  
  const [getAllBootcamps, { data, isLoading, error }] = useGetAllBootcampsMutation();
  
  // Add state for 3D Secure popup
  const [securePopupOpen, setSecurePopupOpen] = useState(false);
  const [secureHtmlContent, setSecureHtmlContent] = useState('');



  const createHubConnection = async () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(payHub, {
                accessTokenFactory: () => nameIdentifier,
            })
            .configureLogging(LogLevel.Information)
            .build();
    
        try {
            await hubConnection.start();
        } catch (error) {
            console.error("Error while starting connection: ", error);
        }
    
        setHubConnection(hubConnection);
    };


    useEffect(()=>{
        if (hubConnection) {
                hubConnection.on("MessageForBootcampSocket",(res) => {
                  console.log("trigger socket response",res)
                  if (res.item1 == "success") {
                    // push('/order_received');
                    toast.success("Ödeme Başarı İle Alındı, Bootcamp Programına Kaydınız Alındı.")
                    handleSecurePopupClose(); // Also close the 3D Secure popup if open
                  }
                  else{
                    toast.warning("İşlem Yürütülürken Bir Sorun Oluştu!!!")
                    // handleClose();
                    handleSecurePopupClose(); // Also close the 3D Secure popup if open
                  }
                })
        }
    },[hubConnection])
   useEffect(()=>{
        createHubConnection();

    },[nameIdentifier])

  useEffect(() => {
    getAllBootcamps(requestBody);
  }, [getAllBootcamps, currentPage]);
  
  // Add effect to handle HTML content when available
  useEffect(() => {
    if (html) {
      // Fetch the HTML content from the blob URL
      fetch(html)
        .then(response => response.text())
        .then(htmlContent => {
          setSecureHtmlContent(htmlContent);
          setSecurePopupOpen(true);
        })
        .catch(error => {
          console.error("Error fetching 3D Secure content:", error);
          toast.error("3D Secure doğrulama ekranı yüklenemedi.");
        });
    }
  }, [html]);

  // Add function to close the 3D Secure popup
  const handleSecurePopupClose = () => {
    setSecurePopupOpen(false);
    setHtml(null);
    setSecureHtmlContent('');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewDetails = (bootcamp) => {
    setSelectedBootcamp(bootcamp);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Add handler for checkout button
  const handleCheckoutOpen = () => {
    setCheckoutModalOpen(true);
    // Optionally, you might want to close the details dialog
    // setDialogOpen(false);
  };

  const handleCheckoutClose = () => {
    setCheckoutModalOpen(false);
  };

  // Add handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Add handler for applying discount coupon
  const handleApplyCoupon = () => {
    // This would typically check against an API
    // For demo, let's just apply a fixed discount if any code is entered
    if (formData.couponCode.trim()) {
      setDiscount({
        applied: true,
        amount: selectedBootcamp.price * 0.1, // 10% discount for demo
        code: formData.couponCode
      });
    }
  };
  

 // public string FullName { get; set; }
  // public string Email { get; set; }
  // public string PhoneNumber { get; set; }
  // public string CardHolderName { get; set; }
  // public string CardNumber { get; set; }
  // public string ExpireMonth { get; set; }
  // public string ExpireYear { get; set; }
  // public string cvc { get; set; }
  // public string IdentityNumber { get; set; }
  // public string UserId { get; set; }
  // public Guid BootcampId { get; set; }



  // Add handler for form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    console.log("trigger form data",formData) 

    console.log("trigger selected bootcamp",selectedBootcamp) 

    var formDataToSend = new FormData();
    formDataToSend.append("FullName", formData.fullName);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("PhoneNumber", formData.phone);
    formDataToSend.append("CardHolderName", formData.cardName);
    formDataToSend.append("CardNumber", formData.cardNumber);
    formDataToSend.append("ExpireMonth", formData.expireMonth);
    formDataToSend.append("ExpireYear", formData.expireYear);
    formDataToSend.append("cvc", formData.cvv);
    formDataToSend.append("IdentityNumber", formData.identityNumber);
    formDataToSend.append("BootcampId", selectedBootcamp.id);

    const sendData = {
      paymentModel:formDataToSend,
      isActive3dSecure:true
  }
    await createPayment(sendData).then((response) => {
      console.log("trigger payment response",response)
      if (response.data.isSuccess ) {
                  if (true) {
                      const blob = new Blob([response.data.result[0].item1.content], { type: "text/html" });
                      const objUrl = URL.createObjectURL(blob);
                      setHtml(objUrl);
                      // handleOpen();    
                  }
              }  else if(!response.data.isSuccess) {
                  toast.info(response.data.messages[0] + ".Please check your information again");
                  // alert('user not existed! credential is : user@*****.com | vendor@*****.com | admin@*****.com');
              }
    })


    // Here you would process the payment
    // alert('Ödeme işlemi tamamlandı! Bootcamp programına kaydınız alındı.');
    setCheckoutModalOpen(false);
  };
  
  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedBootcamp) return 0;
    return discount.applied 
      ? selectedBootcamp.price - discount.amount 
      : selectedBootcamp.price;
  };

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 className="error-message">
          Bootcamp listesi yüklenirken bir hata oluştu.
        </h2>
      </div>
    );
  }
  console.log("trigger data",data)
  const bootcamps = data?.result?.data || [];
  const totalPages = data?.result?.paginationCounter || 1;
  const totalItems = data?.result?.totalItems || 0;
  
  return (
    <>
    <Navbar />
    <div className="bootcamp-container">
      <h1 className="page-title">Bootcamp Programları</h1>
      <p className="page-subtitle">
        Kariyerinizi geliştirecek en güncel bootcamp programlarını keşfedin
      </p>
      
      <div className="bootcamp-stats">
        <span className="bootcamp-count">Toplam {totalItems} bootcamp bulundu</span>
        <span className="bootcamp-page">Sayfa {currentPage}/{totalPages}</span>
      </div>
      
      <div className="bootcamp-grid">
        {bootcamps.map((bootcamp) => (
          <div className="bootcamp-card" key={bootcamp.id}>
            <div className="bootcamp-badge">
              <BadgeIcon /> BOOTCAMP
            </div>
            <div className="card-image-container">
              <div className="card-overlay">
                <span className="level-tag">{bootcamp.level || 'Başlangıç'} Seviye</span>
              </div>
              <img 
                className="bootcamp-image"
                src={bootcamp.thumbnail_Url || 'https://via.placeholder.com/400x200?text=Bootcamp'}
                alt={bootcamp.title}
              />
            </div>
            <div className="bootcamp-content">
              <h2 className="bootcamp-title">{bootcamp.title}</h2>
              <p className="bootcamp-short-desc">{bootcamp.short_Description}</p>
              
              <div className="progress-bar-container">
                <div className="bootcamp-progress" style={{width: '75%'}}></div>
                <span className="bootcamp-progress-text">Kaydol!</span>
              </div>
              
              <div className="bootcamp-info">
                <div className="info-item">
                  <CalendarIcon />
                  <span>
                    {formatDate(bootcamp.start_Date)} - {formatDate(bootcamp.end_Date)}
                  </span>
                </div>
                
                <div className="info-item">
                  <LocationIcon />
                  <span>{bootcamp.isOnline ? 'Online' : 'Yüz yüze'}</span>
                </div>
                
                <div className="info-item">
                  <TimeIcon />
                  <span>{bootcamp.duration || '8'} Hafta</span>
                </div>
                
                <div className="info-item">
                  <PeopleIcon />
                  <span>Kontenjan: {bootcamp.maxAttendees || '25'}</span>
                </div>
                
                <div className="info-item price-item">
                  <MoneyIcon />
                  <span className="bootcamp-price">{bootcamp.price} TL</span>
                </div>
              </div>
              
              <div className="bootcamp-topics">
                {bootcamp.bootcampTopics && bootcamp.bootcampTopics.length > 0 ? (
                  <>
                    {bootcamp.bootcampTopics.slice(0, 3).map((topic) => (
                      <span key={topic.id} className="topic-chip">{topic.title}</span>
                    ))}
                    {bootcamp.bootcampTopics.length > 3 && (
                      <span className="more-chip">+{bootcamp.bootcampTopics.length - 3}</span>
                    )}
                  </>
                ) : (
                  <span className="no-topics">Konular belirtilmemiş</span>
                )}
              </div>
              
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(bootcamp)}
              >
                Detayları Gör <ArrowForwardIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Updated pagination based on API response */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button 
            key={page} 
            className={`page-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
            disabled={isLoading}
          >
            {page}
          </button>
        ))}
      </div>
      
      {/* Bootcamp Details Dialog */}
      {dialogOpen && selectedBootcamp && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="details-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">
              <h2>{selectedBootcamp.title}</h2>
              <button className="close-button" onClick={closeDialog}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="bootcamp-detail-container">
                <img
                  className="detail-image"
                  src={selectedBootcamp.thumbnail_Url || 'https://via.placeholder.com/800x400?text=Bootcamp'}
                  alt={selectedBootcamp.title}
                />
                
                <div className="main-info">
                  <div className="info-grid">
                    <div className="info-col-main">
                      <h3>Bootcamp Hakkında</h3>
                      <p className="bootcamp-description">{selectedBootcamp.description}</p>
                      
                      <h3>Konular</h3>
                      <div className="topics-container">
                        {selectedBootcamp.bootcampTopics && selectedBootcamp.bootcampTopics.length > 0 ? (
                          selectedBootcamp.bootcampTopics.map((topic) => (
                            <span key={topic.id} className="detail-topic-chip">{topic.title}</span>
                          ))
                        ) : (
                          <span className="no-topics">Konular belirtilmemiş</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="info-col-side">
                      <div className="info-card">
                        <h3>Bootcamp Bilgileri</h3>
                        
                        <div className="info-detail-item">
                          <CalendarIcon />
                          <div>
                            <h4>Tarih</h4>
                            <p>{formatDate(selectedBootcamp.start_Date)} - {formatDate(selectedBootcamp.end_Date)}</p>
                          </div>
                        </div>
                        
                        <div className="info-detail-item">
                          <LocationIcon />
                          <div>
                            <h4>Konum</h4>
                            <p>{selectedBootcamp.isOnline ? 'Online' : 'Yüz yüze'}</p>
                          </div>
                        </div>
                        
                        <div className="info-detail-item">
                          <MoneyIcon />
                          <div>
                            <h4>Fiyat</h4>
                            <p className="price-bold">{selectedBootcamp.price} TL</p>
                          </div>
                        </div>
                        
                        <button className="enroll-button" onClick={handleCheckoutOpen}>
                          Şimdi Katıl
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBootcamp.bootcampSchedule && selectedBootcamp.bootcampSchedule.length > 0 && (
                  <div className="schedule-section">
                    <h3>Program Akışı</h3>
                    
                    <div className="schedule-timeline">
                      {selectedBootcamp.bootcampSchedule.map((schedule) => (
                        <div key={schedule.id} className="schedule-item">
                          <div className="timeline-dot"></div>
                          <div className="schedule-content">
                            <h4>{schedule.topic}</h4>
                            <div className="schedule-time-info">
                              <div className="schedule-time-item">
                                <CalendarIcon />
                                <span>{formatDate(schedule.date)}</span>
                              </div>
                              <div className="schedule-time-item">
                                <TimeIcon />
                                <span>{schedule.startAndEndDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Checkout Modal with Collapsible Sections */}
      {checkoutModalOpen && (
        <div className="modal-overlay" onClick={handleCheckoutClose}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bootcamp Kayıt ve Ödeme</h2>
              <button className="close-button" onClick={handleCheckoutClose}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="checkout-bootcamp-info">
                <img 
                  src={selectedBootcamp?.thumbnail_Url || 'https://via.placeholder.com/120x80?text=Bootcamp'} 
                  alt={selectedBootcamp?.title}
                  className="checkout-thumbnail" 
                />
                <div className="checkout-bootcamp-details">
                  <h3>{selectedBootcamp?.title}</h3>
                  <p className="checkout-bootcamp-dates">
                    <CalendarIcon /> {formatDate(selectedBootcamp?.start_Date)} - {formatDate(selectedBootcamp?.end_Date)}
                  </p>
                </div>
              </div>

              <form className="checkout-form" onSubmit={handlePaymentSubmit}>
                {/* Collapsible Personal Information Section */}
                <div className={`collapsible-section ${expandedSection === 'personal' ? 'expanded' : ''}`}>
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection('personal')}
                  >
                    <h4>
                      <span className="section-number">1</span>
                      Kişisel Bilgiler
                    </h4>
                    <span className="toggle-icon">{expandedSection === 'personal' ? '−' : '+'}</span>
                  </div>
                  
                  <div className="section-content">
                    <div className="form-group">
                      <label>Ad Soyad</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName}
                        onChange={handleFormChange}
                        placeholder="Adınız ve soyadınız" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Kimlik No:</label>
                      <input 
                        type="text" 
                        name="identityNumber" 
                        value={formData.identityNumber}
                        onChange={handleFormChange}
                        placeholder="TC Kimlik Numaranız"
                        pattern="\d{11}" 
                        required 
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>E-posta Adresi</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="örnek@mail.com" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefon</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="0 5XX XXX XX XX" 
                          required 
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="continue-button"
                      onClick={() => toggleSection('coupon')}
                    >
                      Devam Et
                    </button>
                  </div>
                </div>
                
                {/* Collapsible Discount Coupon Section */}
                <div className={`collapsible-section ${expandedSection === 'coupon' ? 'expanded' : ''}`}>
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection('coupon')}
                  >
                    <h4>
                      <span className="section-number">2</span>
                      İndirim Kuponu
                    </h4>
                    <span className="toggle-icon">{expandedSection === 'coupon' ? '−' : '+'}</span>
                  </div>
                  
                  <div className="section-content">
                    <div className="coupon-container">
                      <label>Kupon Kodu (Opsiyonel)</label>
                      <div className="coupon-input-group">
                        <input 
                          type="text" 
                          name="couponCode" 
                          value={formData.couponCode}
                          onChange={handleFormChange}
                          placeholder="İndirim kuponu kodunuz varsa buraya girin" 
                          disabled={discount.applied}
                        />
                        <button 
                          type="button" 
                          className="coupon-button" 
                          onClick={handleApplyCoupon}
                          disabled={discount.applied || !formData.couponCode.trim()}
                        >
                          Uygula
                        </button>
                      </div>
                      
                      {discount.applied && (
                        <div className="discount-applied">
                          <div className="coupon-badge">
                            <span className="coupon-code">{discount.code}</span>
                            <span className="discount-amount">{discount.amount.toFixed(2)} TL indirim</span>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        type="button" 
                        className="continue-button"
                        onClick={() => toggleSection('payment')}
                      >
                        {discount.applied ? 'İndirim Uygulandı, Devam Et' : 'Kupon Kullanmadan Devam Et'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Collapsible Payment Details Section */}
                <div className={`collapsible-section ${expandedSection === 'payment' ? 'expanded' : ''}`}>
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection('payment')}
                  >
                    <h4>
                      <span className="section-number">3</span>
                      Ödeme Bilgileri
                    </h4>
                    <span className="toggle-icon">{expandedSection === 'payment' ? '−' : '+'}</span>
                  </div>
                  
                  <div className="section-content">
                    <div className="card-input-container">
                      <div className="card-header">
                        <div className="card-types">
                          <span className="card-type visa">Visa</span>
                          <span className="card-type mastercard">MasterCard</span>
                          <span className="card-type amex">Amex</span>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Kart Sahibinin Adı</label>
                        <input 
                          type="text" 
                          name="cardName" 
                          value={formData.cardName}
                          onChange={handleFormChange}
                          placeholder="Kart üzerindeki isim" 
                          required 
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Kart Numarası</label>
                        <div className="card-number-input">
                          <input 
                            type="text" 
                            name="cardNumber" 
                            value={formData.cardNumber}
                            onChange={handleFormChange}
                            placeholder="XXXX XXXX XXXX XXXX" 
                            required 
                          />
                          <span className="card-icon">💳</span>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Son Kullanma Tarihi</label>
                          <input 
                            type="text" 
                            name="expireMonth"
                            value={formData.expireMonth} 
                            onChange={handleFormChange}
                            placeholder="AA" 
                            required 
                          />
                           <input 
                            type="text" 
                            name="expireYear"
                            value={formData.expireYear} 
                            onChange={handleFormChange}
                            placeholder="YY" 
                            required 
                          />
                        </div>
                        <div className="form-group card-cvv">
                          <label>CVC/CVV</label>
                          <div className="cvv-input">
                            <input 
                              type="text" 
                              name="cvv" 
                              value={formData.cvv}
                              onChange={handleFormChange}
                              placeholder="123" 
                              required 
                            />
                            <span className="cvv-info" title="Kartınızın arkasındaki 3 haneli güvenlik kodu">?</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Price Summary Section */}
                <div className="price-summary">
                  <h4>Ödeme Özeti</h4>
                  
                  <div className="price-row">
                    <span>Bootcamp Ücreti:</span>
                    <span className="price-value">{selectedBootcamp?.price?.toFixed(2)} TL</span>
                  </div>
                  
                  {discount.applied && (
                    <div className="price-row discount">
                      <span>İndirim:</span>
                      <span className="price-value discount-value">-{discount.amount?.toFixed(2)} TL</span>
                    </div>
                  )}
                  
                  <div className="price-row total">
                    <span>Toplam Ödenecek Tutar:</span>
                    <span className="final-price">{calculateFinalPrice()?.toFixed(2)} TL</span>
                  </div>
                  
                  <div className="payment-actions">
                    <button type="submit" className="payment-button">Ödemeyi Tamamla</button>
                    <p className="secure-payment-notice">
                      <span className="lock-icon">🔒</span> 
                      Ödeme bilgileriniz güvenli bir şekilde işleniyor
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Add the 3D Secure popup */}
      {securePopupOpen && secureHtmlContent && (
        <SecurePaymentPopup 
          htmlContent={secureHtmlContent} 
          onClose={handleSecurePopupClose} 
        />
      )}
      
    </div>
    <Footer />
    </>
  );
};

export default StudentBootcampList;
