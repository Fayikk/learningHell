import React, { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/dateFormatter';
import './styles.css';
import { useGetAllBootcampsMutation } from '../../../api/bootcampApi';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../footer/Footer';
import { useCheckInstallmentDebitCardMutation, usePaymentBootcampCheckoutMutation, usePaymentCheckoutMutation } from '../../../api/paymentApi';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { payHub } from '../../../api/Base/payHubModel';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { rootBaseUrl,baseUrl } from '../../../api/Base/baseApiModel';
import BootcampFAQ from '../FAQ/BootcampFAQ'; // Import the FAQ component
import { useGetCouponByCodeMutation } from '../../../api/couponApi';
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

// Add WhatsApp Icon component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
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

// Add new icon for instructor
const InstructorIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// Add new icon for FAQ
const FaqIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.5.51-.86.97-1.04 1.69-.08.32-.13.68-.13 1.14h-2v-.5c0-.46.08-.9.22-1.31.2-.58.53-1.1.95-1.52l1.24-1.26c.46-.44.68-1.1.55-1.8-.13-.72-.69-1.33-1.39-1.53-.83-.24-1.75.1-2.29.85-.25.36-.4.79-.4 1.27h-2c0-1.1.31-1.94.84-2.59.83-1.03 2.15-1.52 3.44-1.36 1.41.17 2.63 1.17 3 2.53.27 1.02.05 2.02-.51 2.84z"/>
  </svg>
);

const StudentBootcampList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [createPayment] = usePaymentBootcampCheckoutMutation();
  const [checkInstallmentDebitCard] = useCheckInstallmentDebitCardMutation();
  const [hubConnection,setHubConnection] = useState();
  const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
  const [discountDetail] = useGetCouponByCodeMutation();
  const [html, setHtml] = useState(null);
  const [activeTab, setActiveTab] = useState('bootcamp'); 
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

  const navigate = useNavigate();
  console.log("trigger nameIdentifier",nameIdentifier)
  
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
                    navigate("/Bootcamp/SuccessPay", { state: { userDetails: nameIdentifier,bootcampDetails:selectedBootcamp,orderDetails:res.item3} });
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

  console.log("trigger selected bootcamps",selectedBootcamp)
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
    console.log("trigger handleViewDetails",bootcamp)
    navigate(`/Bootcamp/Detail/${bootcamp.slug}`);
    setSelectedBootcamp(bootcamp);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Add handler for checkout button
  const handleCheckoutOpen = () => {

    if (localStorage.getItem("token") == null) {
      toast.warning("Ödeme işlemi için giriş yapmalısınız!");
      navigate("/login")
      return;
      
    }


    setCheckoutModalOpen(true);
    // Optionally, you might want to close the details dialog
    // setDialogOpen(false);
  };

  const handleCheckoutClose = () => {
    setCheckoutModalOpen(false);
  };

  // Updated function to check installment options when card number changes
  const checkInstallmentOptions = async (cardNumber) => {
    // Check if the card number is at least 6 digits to get the BIN number
    if (cardNumber.length >= 6) {
      const binNumber = cardNumber.substring(0, 6);
      
      setIsCheckingInstallments(true);
      
      try {
        const requestBody = {
          price: selectedBootcamp.price,
          binNumber: binNumber,
          locale: "tr",
          conversationId: Date.now().toString() // Generate a unique conversation ID
        };
        
        const response = await checkInstallmentDebitCard(requestBody);
        
        // Updated to handle the new response structure
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
    if (name === 'cardNumber' && selectedBootcamp) {
      // Remove any non-digit characters
      const cleanCardNumber = value.replace(/\D/g, '');
      if (cleanCardNumber.length === 16 ) {
        checkInstallmentOptions(cleanCardNumber);
      }
    }
  };
  
  // Add handler for applying discount coupon
  const handleApplyCoupon = async () => {
    console.log("trigger handleApplyCoupon",formData.couponCode)
    // This would typically check against an API
    // For demo, let's just apply a fixed discount if any code is entered
      await discountDetail(discount.code.trim()).then((response) => {
        console.log("trigger discount coupon response",response)

      });

      // setDiscount({
      //   applied: true,
      //   amount: selectedBootcamp.price * 0.1, // 10% discount for demo
      //   code: formData.couponCode
      // });
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



  // Add handler for installment selection
  const handleInstallmentChange = (installmentNumber) => {
    setSelectedInstallment(installmentNumber);
  };

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
    // Add installment information
    formDataToSend.append("InstallmentNumber", selectedInstallment);

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
  
  // Calculate final price after discount and with installment
  const calculateFinalPrice = () => {
    if (!selectedBootcamp) return 0;
    
    let price = discount.applied 
      ? selectedBootcamp.price - discount.amount 
      : selectedBootcamp.price;
    
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
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Yepyeni Bootcampleri Keşfet</title>
      <meta name="description" content="Learning Hell platformunda yazılım, tasarım ve dijital pazarlama alanındaki en güncel bootcamp'leri keşfedin ve kariyer yolculuğunuzu hızlandırın." />
<meta property="og:title" content="Bootcamp Listesi | Learning Hell" />
<meta property="og:description" content="Learning Hell platformunda yazılım, tasarım ve dijital pazarlama alanındaki en güncel bootcamp'leri keşfedin ve kariyer yolculuğunuzu hızlandırın." />
<meta property="og:type" content="website" />
<meta property="og:locale" content="tr_TR" />
<meta property="og:image" content="https://thestatetimes.com/wp-content/uploads/2019/10/schools-2-jumbo.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Learning Hell Bootcamp Listesi" />
    </Helmet>
    
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
                <span className="level-tag">{bootcamp.level || 'Genel'} Seviye</span>
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
                {/* <div className="info-item">
                  <CalendarIcon />
                  <span>
                    {formatDate(bootcamp.start_Date)} - {formatDate(bootcamp.end_Date)}
                  </span>
                </div> */}
                
                <div className="info-item">
                  <LocationIcon />
                  <span>{bootcamp.isOnline ? 'Online' : 'Yüz yüze'}</span>
                </div>
                
                <div className="info-item">
                  <TimeIcon />
                  <span>{bootcamp.duration || '8 - 14'} Hafta</span>
                </div>
                
                <div className="info-item">
                  <PeopleIcon />
                  <span>Kontenjan: {bootcamp.maxAttendees || '12'}</span>
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
      
      {/* Modified Bootcamp Details Dialog with Tabs */}
      {dialogOpen && selectedBootcamp && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="details-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">
              <h2>{selectedBootcamp.title}</h2>
              <button className="close-button" onClick={closeDialog}>
                <CloseIcon />
              </button>
            </div>
            
            {/* Updated Tab Navigation with FAQ tab */}
            <div className="detail-tabs">
              <button 
                className={`tab-button ${activeTab === 'bootcamp' ? 'active' : ''}`} 
                onClick={() => setActiveTab('bootcamp')}
              >
                <CalendarIcon /> Bootcamp Detayları
              </button>
              <button 
                className={`tab-button ${activeTab === 'instructor' ? 'active' : ''}`} 
                onClick={() => setActiveTab('instructor')}
              >
                <InstructorIcon /> Eğitmen Detayları
              </button>
              <button 
                className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`} 
                onClick={() => setActiveTab('faq')}
              >
                <FaqIcon /> Sıkça Sorulan Sorular
              </button>
            </div>
            
            <div className="dialog-content">
              {/* Bootcamp Details Tab */}
              {activeTab === 'bootcamp' && (
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
              )}
              
              {/* Instructor Details Tab */}
              {activeTab === 'instructor' && selectedBootcamp.bootcampInstructorDetail && (
                <div className="instructor-detail-container">
                  <div className="instructor-header">
                    <div className="instructor-image-container">
                      <img
                        className="instructor-image"
                        src={
                          selectedBootcamp.bootcampInstructorDetail.image_Url
                            ? `${rootBaseUrl}${selectedBootcamp.bootcampInstructorDetail.image_Url.replace(/\\/g, '/').replace(/^api\//, '')}`
                            : 'https://via.placeholder.com/200x200?text=Instructor'
                        }
                        
                        alt={selectedBootcamp.bootcampInstructorDetail.full_Name}
                      />
                    </div>
                    <div className="instructor-headline">
                      <h2>{selectedBootcamp.bootcampInstructorDetail.full_Name}</h2>
                      <p className="instructor-title">{selectedBootcamp.bootcampInstructorDetail.short_Description || 'Eğitmen'}</p>
                      
                      <div className="social-links">
                        {selectedBootcamp.bootcampInstructorDetail.linkedIn_Url && (
                          <a href={selectedBootcamp.bootcampInstructorDetail.linkedIn_Url} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                            </svg>
                          </a>
                        )}
                        {selectedBootcamp.bootcampInstructorDetail.twitter_Url && (
                          <a href={selectedBootcamp.bootcampInstructorDetail.twitter_Url} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                            </svg>
                          </a>
                        )}
                        {selectedBootcamp.bootcampInstructorDetail.instagram_Url && (
                          <a href={selectedBootcamp.bootcampInstructorDetail.instagram_Url} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                            </svg>
                          </a>
                        )}
                        {selectedBootcamp.bootcampInstructorDetail.udemy_Url && (
                          <a href={selectedBootcamp.bootcampInstructorDetail.udemy_Url} target="_blank" rel="noopener noreferrer" className="social-link udemy">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                              <path d="M12 0L5.81 3.573v3.574l6.189-3.573 6.191 3.573V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.177 24 11.973 24s3.269-.482 4.448-1.474c1.179-.991 1.768-2.439 1.768-4.234v-8.144l-6.216 3.622z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="instructor-details">
                    <div className="detail-section">
                      <h3>Hakkında</h3>
                      <p>{selectedBootcamp.bootcampInstructorDetail.description || 'Eğitmen hakkında bilgi bulunmamaktadır.'}</p>
                    </div>
                    
                    <div className="instructor-credentials">
                      <div className="credential-section">
                        <h3>Eğitim</h3>
                        <p>{selectedBootcamp.bootcampInstructorDetail.education || 'Belirtilmemiş'}</p>
                      </div>
                      
                      <div className="credential-section">
                        <h3>Deneyim</h3>
                        <p>{selectedBootcamp.bootcampInstructorDetail.experience || 'Belirtilmemiş'}</p>
                      </div>
                      
                      {selectedBootcamp.bootcampInstructorDetail.skills && (
                        <div className="credential-section">
                          <h3>Yetenekler</h3>
                          <div className="skills-container">
                            {selectedBootcamp.bootcampInstructorDetail.skills.split(',').map((skill, index) => (
                              <span key={index} className="skill-chip">{skill.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="instructor-footer">
                      <button className="enroll-button" onClick={handleCheckoutOpen}>
                        Bu Eğitmenin Bootcamp'ine Kaydol
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* New FAQ Tab */}
              {activeTab === 'faq' && (
                <BootcampFAQ bootcampTitle={selectedBootcamp.title} />
              )}
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
                        <span className="price-value">{selectedBootcamp?.price?.toFixed(2)} TL</span>
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
      
      {/* Add WhatsApp floating button */}
      <div className="whatsapp-container">
  <div className="whatsapp-button-container">
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
  </div>
</div>
      
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
