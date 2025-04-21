import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import Navbar from '../../../Navbar/Navbar';
import Footer from '../../../footer/Footer';
import { useGetBootcampBySlugQuery } from '../../../../api/bootcampApi';
import { formatDate } from '../../../../utils/dateFormatter';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCheckInstallmentDebitCardMutation, usePaymentBootcampCheckoutMutation } from '../../../../api/paymentApi';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { payHub } from '../../../../api/Base/payHubModel';
import { rootBaseUrl } from '../../../../api/Base/baseApiModel';
import BootcampFAQ from '../../../Bootcamps/FAQ/BootcampFAQ';
import {Helmet} from "react-helmet";

// SVG Icons as React components
const CalendarIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
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

// Add social media icon components
const LinkedInIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

const UdemyIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0L5.81 3.573v3.574l6.19-3.573 6.19 3.573V3.573L12 0zm0 7.147l-4.328 2.5v9.075L12 21.22l4.328-2.498V9.647L12 7.147zm0 5.013l2.465 1.427-2.465 1.427-2.465-1.427L12 12.16z"/>
  </svg>
);

// Add a new icon component for Profile/User
const UserIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// Add education icon
const EducationIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

const FaqIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.5.51-.86.97-1.04 1.69-.08.32-.13.68-.13 1.14h-2v-.5c0-.46.08-.9.22-1.31.2-.58.53-1.1.95-1.52l1.24-1.26c.46-.44.68-1.1.55-1.8-.13-.72-.69-1.33-1.39-1.53-.83-.24-1.75.1-2.29.85-.25.36-.4.79-.4 1.27h-2c0-1.1.31-1.94.84-2.59.83-1.03 2.15-1.52 3.44-1.36 1.41.17 2.63 1.17 3 2.53.27 1.02.05 2.02-.51 2.84z"/>
  </svg>
);
const InstructorIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);



// Improved 3D Secure Popup component
const SecurePaymentPopup = ({ htmlContent, onClose }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  useEffect(() => {
    // Add a timeout to show loading state
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        console.log("3D Secure iframe taking longer than expected to load");
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  return (
    <div className="secure-payment-overlay">
      <div className="secure-payment-popup">
        <div className="secure-payment-header">
          <h3>3D Secure Doğrulama</h3>
          <button className="secure-close-button" onClick={onClose}>×</button>
        </div>
        <div className="secure-payment-content">
          {!iframeLoaded && (
            <div className="secure-payment-loading">
              <div className="loading-spinner"></div>
              <p>3D Secure doğrulama yükleniyor...</p>
            </div>
          )}
          <iframe
            srcDoc={htmlContent}
            title="3D Secure Verification"
            className="secure-payment-iframe"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
            onLoad={() => setIframeLoaded(true)}
            style={{ opacity: iframeLoaded ? 1 : 0 }}
          />
        </div>
      </div>
    </div>
  );
};

function BootcampDetail() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetBootcampBySlugQuery(slug);
  const navigate = useNavigate();
  const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
  
  // New states for enrollment modal functionality
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('not-enrolled'); // 'not-enrolled', 'processing', 'enrolled', 'failed'
  
  // Checkout modal states from StudentBootcampList
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('personal');
  const [createPayment] = usePaymentBootcampCheckoutMutation();
  const [checkInstallmentDebitCard] = useCheckInstallmentDebitCardMutation();
  const [hubConnection, setHubConnection] = useState();
  const [html, setHtml] = useState(null);
  const [securePopupOpen, setSecurePopupOpen] = useState(false);
  const [secureHtmlContent, setSecureHtmlContent] = useState('');
  
  // Add new state variables for installment options
  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(1); // Default to single payment
  const [isCheckingInstallments, setIsCheckingInstallments] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardType: '',
    cardAssociation: '',
    bankName: '',
    cardFamilyName: ''
  });
  
  // Add new state variables for form data and discount
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    couponCode: '',
    cardName: '',
    cardNumber: '',
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
  
  // Payment options for the bootcamp with Turkish Lira
  
  // Create hub connection for payment processing
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

  // Setup hub connection on component mount if user is logged in
  useEffect(() => {
    createHubConnection();
  }, [nameIdentifier]);

  // Handle hub connection messages
  useEffect(() => {
    if (hubConnection) {
      hubConnection.on("MessageForBootcampSocket", (res) => {
        if (res.item1 == "success") {
          toast.success("Ödeme Başarı İle Alındı, Bootcamp Programına Kaydınız Alındı.")
          handleSecurePopupClose(); // Also close the 3D Secure popup if open
          navigate("/Bootcamp/SuccessPay", { state: { userDetails: nameIdentifier, bootcampDetails: data?.result, orderDetails: res.item3 } });
        } else {
          toast.warning("İşlem Yürütülürken Bir Sorun Oluştu!!!")
          handleSecurePopupClose(); // Also close the 3D Secure popup if open
        }
      })
    }
  }, [hubConnection]);

  // Add effect to handle HTML content when available
  useEffect(() => {
    if (html) {
      // Fetch the HTML content from the blob URL
      fetch(html)
        .then(response => response.text())
        .then(htmlContent => {
          // Clean or prepare HTML if needed
          const preparedHtml = htmlContent
            .replace(/<meta[^>]*>/g, '') // Remove meta tags that might cause issues
            .replace(/<base[^>]*>/g, ''); // Remove base tags
          
          setSecureHtmlContent(preparedHtml);
          setSecurePopupOpen(true);
        })
        .catch(error => {
          console.error("Error fetching 3D Secure content:", error);
          toast.error("3D Secure doğrulama ekranı yüklenemedi.");
        });
    }
  }, [html]);
  
  // Functions for enrollment modal
  const handleEnrollClick = () => {
    if (localStorage.getItem("token") == null) {
      toast.warning("Ödeme işlemi için giriş yapmalısınız!");
      navigate("/login")
      return;
    }
    setCheckoutModalOpen(true);
  };

  const handleCloseEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedPaymentOption(null);
  };
  
  // Checkout modal functions
  const handleCheckoutClose = () => {
    setCheckoutModalOpen(false);
  };
  
  // Function to close the 3D Secure popup
  const handleSecurePopupClose = () => {
    setSecurePopupOpen(false);
    
    // Clean up blob URL to avoid memory leaks
    if (html) {
      URL.revokeObjectURL(html);
      setHtml(null);
    }
    
    setSecureHtmlContent('');
  };

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Updated function to check installment options when card number changes
  const checkInstallmentOptions = async (cardNumber) => {
    // Check if the card number is at least 6 digits to get the BIN number
    if (cardNumber.length >= 6) {
      const binNumber = cardNumber.substring(0, 6);
      
      setIsCheckingInstallments(true);
      
      try {
        const requestBody = {
          price: data?.result?.price || 0,
          binNumber: binNumber,
          locale: "tr",
          conversationId: Date.now().toString() // Generate a unique conversation ID
        };
        
        const response = await checkInstallmentDebitCard(requestBody);
        
        if (response.data && 
            response.data.isSuccess && 
            response.data.result && 
            response.data.result.installmentDetails && 
            response.data.result.installmentDetails.length > 0) {
          
          const cardInfo = response.data.result.installmentDetails[0];
          setInstallmentOptions(cardInfo.installmentPrices || []);
          setCardDetails({
            cardType: cardInfo.cardType,
            cardAssociation: cardInfo.cardAssociation,
            bankName: cardInfo.bankName,
            cardFamilyName: cardInfo.cardFamilyName
          });
          
          // When we get installment options, automatically expand a new section for them
          if (cardInfo.installmentPrices && cardInfo.installmentPrices.length > 0) {
            setExpandedSection('installment');
          }
        } else {
          // Reset if no installment options found
          setInstallmentOptions([]);
          setCardDetails({
            cardType: '',
            cardAssociation: '',
            bankName: '',
            cardFamilyName: ''
          });
        }
      } catch (error) {
        console.error("Error checking installment options:", error);
        toast.error("Taksit seçenekleri kontrol edilirken bir hata oluştu.");
        setInstallmentOptions([]);
      } finally {
        setIsCheckingInstallments(false);
      }
    } else {
      // Clear installment options if card number is too short
      setInstallmentOptions([]);
      setCardDetails({
        cardType: '',
        cardAssociation: '',
        bankName: '',
        cardFamilyName: ''
      });
    }
  };

  // Add handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check for installment options when card number changes
    if (name === 'cardNumber' && data?.result) {
      // Remove any non-digit characters
      const cleanCardNumber = value.replace(/\D/g, '');
      if (cleanCardNumber.length === 16) {
        checkInstallmentOptions(cleanCardNumber);
      }
    }
  };
  
  // Add handler for applying discount coupon
  const handleApplyCoupon = () => {
    // This would typically check against an API
    // For demo, let's just apply a fixed discount if any code is entered
    if (formData.couponCode.trim()) {
      setDiscount({
        applied: true,
        amount: data?.result?.price * 0.1, // 10% discount for demo
        code: formData.couponCode
      });
    }
  };
  
  // Add handler for installment selection
  const handleInstallmentChange = (installmentNumber) => {
    setSelectedInstallment(installmentNumber);
  };

  // Handle form submission and payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const bootcamp = data?.result;
    if (!bootcamp) {
      toast.error("Bootcamp bilgileri bulunamadı.");
      return;
    }

    // Show loading state
    toast.info("Ödeme işlemi başlatılıyor...", { autoClose: false, toastId: "payment-process" });

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
    formDataToSend.append("BootcampId", bootcamp.id);
    // Add installment information
    formDataToSend.append("InstallmentNumber", selectedInstallment);

    const sendData = {
      paymentModel: formDataToSend,
      isActive3dSecure: true
    }

    try {
      const response = await createPayment(sendData);
      toast.dismiss("payment-process");
      
      if (response.data.isSuccess) {
        if (response.data.result && response.data.result[0]?.item1?.content) {
          const blob = new Blob([response.data.result[0].item1.content], { type: "text/html" });
          const objUrl = URL.createObjectURL(blob);
          setHtml(objUrl);
        } else {
          toast.error("3D Secure için gerekli içerik alınamadı.");
        }
      } else {
        const errorMessage = response.data.messages && response.data.messages.length > 0 
          ? response.data.messages[0] 
          : "Ödeme işlemi başlatılamadı.";
        toast.error(`${errorMessage} Lütfen bilgilerinizi kontrol edin.`);
      }
    } catch (error) {
      toast.dismiss("payment-process");
      console.error("Payment error:", error);
      toast.error("Ödeme işlemi sırasında bir hata oluştu.");
    }
  };
  
  // Calculate final price after discount and with installment
  const calculateFinalPrice = () => {
    if (!data?.result) return 0;
    
    let price = discount.applied 
      ? data.result.price - discount.amount 
      : data.result.price;
    
    // If installment option is selected, use the total price from installment
    if (selectedInstallment > 1 && installmentOptions.length > 0) {
      const selectedOption = installmentOptions.find(option => option.installmentNumber === selectedInstallment);
      if (selectedOption) {
        price = parseFloat(selectedOption.totalPrice);
      }
    }
    
    return price;
  };
  
  // Get monthly installment amount if installment selected
  const getMonthlyInstallment = () => {
    if (selectedInstallment > 1 && installmentOptions.length > 0) {
      const selectedOption = installmentOptions.find(option => option.installmentNumber === selectedInstallment);
      if (selectedOption) {
        return parseFloat(selectedOption.price);
      }
    }
    return null;
  };

  // Add state to track student count
  const [studentCount, setStudentCount] = useState(0);
  
  // Update useEffect to calculate student count
  useEffect(() => {
    if (data?.result?.enrollments) {
      setStudentCount(data.result.enrollments.length);
    }
  }, [data]);

  // Add new state for active tab
  const [activeTab, setActiveTab] = useState('bootcamp');
  const [showAllSchedule, setShowAllSchedule] = useState(false);

  // Function to toggle showing all schedule items
  const toggleScheduleView = () => {
    setShowAllSchedule(!showAllSchedule);
  };

  if (isLoading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error || !data || !data.result) {
    return <div className="text-center p-5">Bootcamp not found</div>;
  }

  const bootcamp = data.result;
  return (
    <>
    <Helmet>
      <title>{bootcamp.title} - Bootcamp Detayları</title>
      <meta property="og:title" content={bootcamp.title} />
        <meta property="og:description" content={bootcamp.description} />
        <meta property="og:image" content={bootcamp.thumbnail_Url} />
        <meta property="og:url" content={`https://www.learninghell.com${window.location.pathname}`} />
        <meta property="og:type" content="website" />
    </Helmet>
    <Navbar/>
    <div className="hero-section" style={{ 
      backgroundImage: `url(${bootcamp.thumbnail_Url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{bootcamp.title}</h1>
        <p className="hero-subtitle">{bootcamp.short_Description}</p>
        <div className="hero-badges">
          <Badge bg="light" text="dark" className="hero-badge">
            <CalendarIcon /> {new Date(bootcamp.start_Date).toLocaleDateString('tr-TR')} - {new Date(bootcamp.end_Date).toLocaleDateString('tr-TR')}
          </Badge>
          <Badge bg="light" text="dark" className="hero-badge">
            {bootcamp.isOnline ? 'Online' : 'Yüz Yüze'}
          </Badge>
          <Badge bg="light" text="dark" className="hero-badge">
            <MoneyIcon /> ₺{bootcamp.price.toFixed(2)}
          </Badge>
        </div>
      </div>
    </div>
    
    <Container className="bootcamp-detail-container py-5">
      <Row>
        <Col lg={8}>
          {/* New tabbed interface */}
          <Card className="detail-card mb-4">
            <div className="tab-navigation">
              <Nav variant="tabs" className="custom-tabs">
                <Nav.Item>
                  <Nav.Link 
                    className={activeTab === 'bootcamp' ? 'active' : ''} 
                    onClick={() => setActiveTab('bootcamp')}
                  >
                    {/* <i className="fas fa-laptop-code mr-2"></i> Bootcamp Bilgileri */}
                    <CalendarIcon /> Bootcamp Bilgileri
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={activeTab === 'instructor' ? 'active' : ''} 
                    onClick={() => setActiveTab('instructor')}
                  >
                    {/* <i className="fas fa-chalkboard-teacher mr-2"></i> Eğitmen */}
                    <InstructorIcon /> Eğitmen
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={activeTab === 'faq' ? 'active' : ''} 
                    onClick={() => setActiveTab('faq')}
                  >
                    {/* <i className="fas fa-question-circle mr-2"></i> Sıkça Sorulan Sorular */}
                    <FaqIcon /> Sıkça Sorulan Sorular
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            
            {/* Bootcamp Details Tab Content */}
            {activeTab === 'bootcamp' && (
              <div className="tab-content">
                <div className="card-3d-container">
                  <h3 className="section-title">Neler Öğreneceksiniz</h3>
                  <div className="topics-container mb-4">
                    {bootcamp.bootcampTopics.map((topic) => (
                      <Badge className="topic-badge" key={topic.id}>{topic.title}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="info-section">
                  <h3 className="section-title">Bootcamp Bilgileri</h3>
                  
                  <Row className="bootcamp-stats mb-4">
                    <Col md={4}>
                      <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-value">
                          {Math.ceil((new Date(bootcamp.end_Date) - new Date(bootcamp.start_Date)) / (1000 * 60 * 60 * 24))} gün
                        </div>
                        <div className="stat-label">Süre</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="stat-card">
                        <div className="stat-icon">💻</div>
                        <div className="stat-value">{bootcamp.isOnline ? 'Online' : 'Yüz Yüze'}</div>
                        <div className="stat-label">Format</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="stat-card">
                        <div className="stat-icon">👨‍🏫</div>
                        <div className="stat-value">
                          {bootcamp.bootcampInstructorDetail?.full_Name || 'Belirtilmedi'}
                        </div>
                        <div className="stat-label">Eğitmen</div>
                      </div>
                    </Col>
                  </Row>
                </div>
                
                <div className="description-section mb-4">
                  <h3 className="section-title">Açıklama</h3>
                  <p>{bootcamp.description}</p>
                </div>
                
                <div className="schedule-section">
                  <h3 className="section-title">Program</h3>
                  {bootcamp.bootcampSchedule.length > 0 ? (
                    <div className="schedule-list">
                      {bootcamp.bootcampSchedule
                        .slice(0, showAllSchedule ? bootcamp.bootcampSchedule.length : 5)
                        .map((schedule) => (
                          <div className="schedule-item" key={schedule.id}>
                            <div className="schedule-date">
                              {new Date(schedule.date).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="schedule-details">
                              <h4>{schedule.topic}</h4>
                              <p>{schedule.startAndEndDate}</p>
                            </div>
                          </div>
                        ))}
                        
                      {bootcamp.bootcampSchedule.length > 5 && (
                        <div className="show-more-container">
                          <button 
                            className="show-more-button" 
                            onClick={toggleScheduleView}
                          >
                            {showAllSchedule ? 'Daha Az Göster' : `Daha Fazla Göster (${bootcamp.bootcampSchedule.length - 5} tane daha)`}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>Henüz program detayı bulunmamaktadır.</p>
                  )}
                  
                  <div className="date-cards mt-4">
                    <div className="date-card start">
                      <div className="date-label">Başlangıç Tarihi</div>
                      <div className="date-value">{new Date(bootcamp.start_Date).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="date-connection"></div>
                    <div className="date-card end">
                      <div className="date-label">Bitiş Tarihi</div>
                      <div className="date-value">{new Date(bootcamp.end_Date).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                </div>
                
                {/* Student Count Section */}
                {/* <div className="students-section mt-4">
                  <h3 className="section-title">Katılımcılar</h3>
                  <div className="student-stats">
                    <div className="student-count-card">
                      <div className="count-icon">
                        <UserIcon />
                      </div>
                      <div className="count-details">
                        <span className="count-number">{studentCount}</span>
                        <span className="count-label">Kayıtlı Öğrenci</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
            
            {/* Instructor Tab Content */}
            {activeTab === 'instructor' && bootcamp.bootcampInstructorDetail && (
              <div className="tab-content instructor-tab-content">
                <div className="instructor-section">
                  <div className="instructor-profile">
                    <div className="instructor-header">
                      <div className="instructor-avatar">
                        {bootcamp.bootcampInstructorDetail.image_Url ? (
                          <img 
                            src={bootcamp.bootcampInstructorDetail.image_Url.startsWith('http') 
                              ? bootcamp.bootcampInstructorDetail.image_Url 
                              : `${rootBaseUrl}${bootcamp.bootcampInstructorDetail.image_Url}`} 
                            alt={bootcamp.bootcampInstructorDetail.full_Name} 
                            className="instructor-img"
                          />
                        ) : (
                          <div className="instructor-placeholder">
                            <UserIcon />
                          </div>
                        )}
                      </div>
                      <div className="instructor-info">
                        <h4 className="instructor-name">{bootcamp.bootcampInstructorDetail.full_Name}</h4>
                        {bootcamp.bootcampInstructorDetail.short_Description && (
                          <p className="instructor-title">{bootcamp.bootcampInstructorDetail.short_Description}</p>
                        )}
                        
                        <div className="instructor-social">
                          {bootcamp.bootcampInstructorDetail.linkedIn_Url && (
                            <a href={bootcamp.bootcampInstructorDetail.linkedIn_Url} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                              <LinkedInIcon />
                            </a>
                          )}
                          {bootcamp.bootcampInstructorDetail.twitter_Url && (
                            <a href={bootcamp.bootcampInstructorDetail.twitter_Url} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                              <TwitterIcon />
                            </a>
                          )}
                          {bootcamp.bootcampInstructorDetail.youtube_Url && (
                            <a href={bootcamp.bootcampInstructorDetail.youtube_Url} target="_blank" rel="noopener noreferrer" className="social-link youtube">
                              <YoutubeIcon />
                            </a>
                          )}
                          {bootcamp.bootcampInstructorDetail.udemy_Url && (
                            <a href={bootcamp.bootcampInstructorDetail.udemy_Url} target="_blank" rel="noopener noreferrer" className="social-link udemy">
                              <UdemyIcon />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="instructor-details">
                      {bootcamp.bootcampInstructorDetail.description && (
                        <div className="instructor-bio">
                          <h5>Hakkında</h5>
                          <p>{bootcamp.bootcampInstructorDetail.description}</p>
                        </div>
                      )}
                      
                      <div className="instructor-qualifications">
                        {bootcamp.bootcampInstructorDetail.education && (
                          <div className="qualification-item">
                            <div className="qualification-icon">
                              <EducationIcon />
                            </div>
                            <div className="qualification-content">
                              <h5>Eğitim</h5>
                              <p>{bootcamp.bootcampInstructorDetail.education}</p>
                            </div>
                          </div>
                        )}
                        
                        {bootcamp.bootcampInstructorDetail.experience && (
                          <div className="qualification-item">
                            <div className="qualification-icon">
                              <TimeIcon />
                            </div>
                            <div className="qualification-content">
                              <h5>Deneyim</h5>
                              <p>{bootcamp.bootcampInstructorDetail.experience}</p>
                            </div>
                          </div>
                        )}
                        
                        {bootcamp.bootcampInstructorDetail.skills && (
                          <div className="qualification-item">
                            <div className="qualification-icon">
                              <i className="fas fa-code"></i>
                            </div>
                            <div className="qualification-content">
                              <h5>Yetenekler</h5>
                              <div className="skills-container">
                                {bootcamp.bootcampInstructorDetail.skills.split(',').map((skill, index) => (
                                  <span key={index} className="skill-badge">{skill.trim()}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ Tab Content */}
            {activeTab === 'faq' && (
              <div className="tab-content faq-tab-content">
                <BootcampFAQ bootcampTitle={bootcamp.title} />
              </div>
            )}
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="payment-card">
            <div className="payment-header">
              <h3>Hemen Kaydol</h3>
            </div>
            <Card.Body>
              <div className="price-container">
                <span className="currency">₺</span>
                <span className="price">{bootcamp.price.toFixed(2)}</span>
              </div>
              
              <h5 className="payment-title">Ödeme Seçenekleri</h5>
              {/* {paymentOptions.map((option, index) => (
                <div className="payment-option-card" key={index}>
                  <div className="d-flex justify-content-between">
                    <span className="option-name">{option.method}</span>
                    <span className="option-price">₺{option.amount}</span>
                  </div>
                  {option.discount && (
                    <div className="discount-badge">
                      {option.discount} indirim
                    </div>
                  )}
                </div>
              ))} */}
              
              <Button 
                variant="primary" 
                className="enroll-button pulse-effect"
                onClick={handleEnrollClick}
              >
                Şimdi Kaydol
              </Button>
              
              <div className="guarantee">
                <div className="guarantee-icon">✓</div>
                <div className="guarantee-text">7 gün para iade garantisi</div>
              </div>

              {/* Add instructor badge in sidebar */}
              {bootcamp.bootcampInstructorDetail && (
                <div className="instructor-badge">
                  <div className="instructor-badge-image">
                    {bootcamp.bootcampInstructorDetail.image_Url ? (
                      <img 
                        src={bootcamp.bootcampInstructorDetail.image_Url.startsWith('http') 
                          ? bootcamp.bootcampInstructorDetail.image_Url 
                          : `${rootBaseUrl}${bootcamp.bootcampInstructorDetail.image_Url}`} 
                        alt={bootcamp.bootcampInstructorDetail.full_Name} 
                      />
                    ) : (
                      <div className="instructor-icon">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                  <div className="instructor-badge-info">
                    <div className="instructor-badge-label">Eğitmen</div>
                    <div className="instructor-badge-name">{bootcamp.bootcampInstructorDetail.full_Name}</div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <div className="floating-cta">
            <span className="floating-text">Sınırlı Kontenjan!</span>
          </div>
        </Col>
      </Row>
    </Container>

    {/* Checkout Modal - copied from StudentBootcampList */}

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
            src={bootcamp.thumbnail_Url || 'https://via.placeholder.com/120x80?text=Bootcamp'} 
            alt={bootcamp.title}
            className="checkout-thumbnail" 
          />
          <div className="checkout-bootcamp-details">
            <h3>{bootcamp.title}</h3>
            <p className="checkout-bootcamp-dates">
              <CalendarIcon /> {formatDate(bootcamp.start_Date)} - {formatDate(bootcamp.end_Date)}
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
          
          {/* Updated payment details section with card detection */}
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
                    <span className={`card-type visa ${cardDetails.cardAssociation === 'VISA' ? 'active' : ''}`}>Visa</span>
                    <span className={`card-type mastercard ${cardDetails.cardAssociation === 'MASTER_CARD' ? 'active' : ''}`}>MasterCard</span>
                    <span className={`card-type amex ${cardDetails.cardAssociation === 'AMERICAN_EXPRESS' ? 'active' : ''}`}>Amex</span>
                  </div>
                  
                  {cardDetails.bankName && (
                    <div className="detected-card-info">
                      <span>{cardDetails.bankName} {cardDetails.cardFamilyName}</span>
                    </div>
                  )}
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
                    <span className="card-icon">
                      {isCheckingInstallments ? 
                        <span className="spinner">⟳</span> : 
                        '💳'}
                    </span>
                  </div>
                  {isCheckingInstallments && (
                    <div className="checking-message">
                      Taksit seçenekleri kontrol ediliyor...
                    </div>
                  )}
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
          
          {/* Separate collapsible section for installment options */}
          {installmentOptions.length > 0 && (
            <div className={`collapsible-section installment-section ${expandedSection === 'installment' ? 'expanded' : ''}`}>
              <div 
                className="section-header" 
                onClick={() => toggleSection('installment')}
              >
                <h4>
                  <span className="section-number">4</span>
                  Taksit Seçenekleri
                  <span className="badge new-badge">Yeni</span>
                </h4>
                <span className="toggle-icon">{expandedSection === 'installment' ? '−' : '+'}</span>
              </div>
              
              <div className="section-content">
                <div className="installment-options-container">
                  {cardDetails.bankName && (
                    <div className="card-info-banner">
                      <span className="bank-logo">🏦</span>
                      <span>{cardDetails.bankName} {cardDetails.cardFamilyName} kartınız için taksit seçenekleri</span>
                    </div>
                  )}
                  
                  <div className="installment-options">
                    {/* Display all available installment options from the API response */}
                    {installmentOptions.map((option) => (
                      <div 
                        key={option.installmentNumber} 
                        className={`installment-option ${selectedInstallment === option.installmentNumber ? 'selected' : ''}`}
                        onClick={() => handleInstallmentChange(option.installmentNumber)}
                      >
                        <div className="installment-radio">
                          <input 
                            type="radio" 
                            id={`installment-${option.installmentNumber}`}
                            name="installment"
                            checked={selectedInstallment === option.installmentNumber}
                            onChange={() => handleInstallmentChange(option.installmentNumber)}
                          />
                          <label htmlFor={`installment-${option.installmentNumber}`}>
                            {option.installmentNumber === 1 ? 'Tek Çekim' : `${option.installmentNumber} Taksit`}
                          </label>
                        </div>
                        <div className="installment-details">
                          {option.installmentNumber === 1 ? (
                            <span className="total-price">{option.totalPrice} TL</span>
                          ) : (
                            <>
                              <span className="monthly-price">{option.price} TL x {option.installmentNumber}</span>
                              <span className="total-price">Toplam: {option.totalPrice} TL</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    type="button" 
                    className="continue-button"
                    onClick={() => toggleSection('summary')}
                  >
                    Taksit Seçimini Tamamla
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Updated Price Summary Section with its own collapsible section */}
          <div className={`collapsible-section summary-section ${expandedSection === 'summary' ? 'expanded' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('summary')}
            >
              <h4>
                <span className="section-number">{installmentOptions.length > 0 ? '5' : '4'}</span>
                Ödeme Özeti
              </h4>
              <span className="toggle-icon">{expandedSection === 'summary' ? '−' : '+'}</span>
            </div>
            
            <div className="section-content">
              <div className="price-summary">
                <div className="price-row">
                  <span>Bootcamp Ücreti:</span>
                  <span className="price-value">{bootcamp.price?.toFixed(2)} TL</span>
                </div>
                
                {discount.applied && (
                  <div className="price-row discount">
                    <span>İndirim:</span>
                    <span className="price-value discount-value">-{discount.amount?.toFixed(2)} TL</span>
                  </div>
                )}
                
                {selectedInstallment > 1 && getMonthlyInstallment() && (
                  <div className="price-row installment-info">
                    <span>Taksit:</span>
                    <span className="price-value">{getMonthlyInstallment()?.toFixed(2)} TL x {selectedInstallment} ay</span>
                  </div>
                )}
                
                <div className="price-row total">
                  <span>Toplam Ödenecek Tutar:</span>
                  <span className="final-price">{calculateFinalPrice()?.toFixed(2)} TL</span>
                </div>
                
                <div className="payment-actions">
                  <button type="submit" className="payment-button">
                    {selectedInstallment === 1 ? 'Ödemeyi Tamamla' : `${selectedInstallment} Taksitle Öde`}
                  </button>
                  <p className="secure-payment-notice">
                    <span className="lock-icon">🔒</span> 
                    Ödeme bilgileriniz güvenli bir şekilde işleniyor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



    <a 
        href="https://wa.me/905310149046" 
        className="whatsapp-floating-button" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Bizimle WhatsApp üzerinden iletişime geçin"
      >
        <WhatsAppIcon />
        <span className="whatsapp-tooltip">Bize Ulaşın</span>
      </a>

    {/* Improved 3D Secure popup for payment processing */}
    {securePopupOpen && secureHtmlContent && (
      <SecurePaymentPopup 
        htmlContent={secureHtmlContent} 
        onClose={handleSecurePopupClose} 
      />
    )}

    <Footer/>
    </>
  );
}

export default BootcampDetail;