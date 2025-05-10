import React, { useState, useEffect } from 'react';
import './FreeContent.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';
import { useGetAllFreeContentQuery, useSubmitContactFormMutation } from '../../api/freeContentApi';
import { baseUrl } from '../../api/Base/baseApiModel';
import { useDownloadMaterialFileMutation } from '../../api/materialApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Newslatter2 from '../Newslatter2/Newslatter2';

function FreeContent() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [downloadFreeContentMaterial] = useDownloadMaterialFileMutation();
  // Add state for selected webinar and modal visibility
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch free content data
  const { data, error, isLoading } = useGetAllFreeContentQuery();
  const [submitContactForm] = useSubmitContactFormMutation();

  // Filter content by type
  const getContentByType = (type) => {
    if (!data || !data.result) return [];
    return data.result.filter(item => item.contentType === type);
  };

  // Updated to match exact enum values
  const videoContent = data?.result ? getContentByType('Video') : [];
  const ebookContent = data?.result ? getContentByType('EBook') : []; // Changed to match enum case
  const webinarContent = data?.result ? getContentByType('Webinar') : [];
  const resourceContent = data?.result ? getContentByType('Resource') : [];

  // Extract YouTube video ID from URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return { day: '', month: '' };
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(date);
    return { day, month };
  };

  const handleClickDownloadFreeContentItem = async (fileUrl) => {
    // public string FileUrl { get; set; } = null!;
    // public MaterialType Type { get; set; } 

    const token = localStorage.getItem("token");
    if (token == null) {
      // Store current URL to return after login
      const currentUrl = window.location.pathname;
      // Redirect to login with return URL parameter
      window.location.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      toast.warning("Önce giriş yapmalısınız!");
      return null;
    }

    const formData = {
      fileUrl: fileUrl,
      type: 3
    }

    await downloadFreeContentMaterial(formData).then((response) => {
      if (response.data.isSuccess) {
        const linkSource = `data:application/pdf;base64,${response.data.result}`;
        const downloadLink = document.createElement("a");
        const fileName = fileUrl;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        toast.success("Download process is success completed");
      }
      else {
        toast.error("Ooops! something went wrong");
      }
    });
  }

  // Function to open modal with webinar details
  const openWebinarModal = (webinar) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
    // Prevent page scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWebinar(null);
    // Re-enable page scrolling
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm({ email, message }).unwrap();
      setFormSubmitted(true);
      setEmail('');
      setMessage('');
      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="free-content-container">
        <header className="free-content-header">
          <div className="banner-background">
            <div className="banner-shape banner-shape-1"></div>
            <div className="banner-shape banner-shape-2"></div>
            <div className="banner-shape banner-shape-3"></div>
          </div>
          <div className="header-content">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="banner-title"
            >
              Ücretsiz İçerikler
            </motion.h1>
            <motion.div
              className="banner-line"
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 1.2, delay: 0.4 }}
            ></motion.div>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Öğrenme yolculuğunuza yardımcı olacak ücretsiz kaynaklarımız
            </motion.p>

            <motion.div
              className="banner-icon-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {videoContent.length > 0 && (
                <div className="banner-icon-item">
                  <span className="banner-icon">🎬</span>
                  <span className="banner-icon-text">Videolar</span>
                </div>
              )}
              {ebookContent.length > 0 && (
                <div className="banner-icon-item">
                  <span className="banner-icon">📚</span>
                  <span className="banner-icon-text">E-Kitaplar</span>
                </div>
              )}
              {webinarContent.length > 0 && (
                <div className="banner-icon-item">
                  <span className="banner-icon">🎯</span>
                  <span className="banner-icon-text">Webinarlar</span>
                </div>
              )}
              {resourceContent.length > 0 && (
                <div className="banner-icon-item">
                  <span className="banner-icon">📁</span>
                  <span className="banner-icon-text">Kaynaklar</span>
                </div>
              )}
            </motion.div>
          </div>
        </header>

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>İçerikler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <i className="error-icon">⚠️</i>
            <p>İçerikler yüklenirken bir hata oluştu: {error.message}</p>
          </div>
        )}

        <div className="content-grid">
          {/* Video Section */}
          {videoContent.length > 0 && (
            <motion.section
              className="content-section video-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <span className="section-icon">🎬</span>
                Eğitim Videoları
              </h2>
              <div className="video-container">
                {videoContent.map((video, index) => (
                  <motion.div
                    className="video-card"
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                  >
                    <div className="video-wrapper">
                      <iframe
                        src={getYoutubeEmbedUrl(video.contentUrl)}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                      </iframe>
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      <p>{video.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* E-Book Section */}
          {ebookContent.length > 0 && (
            <motion.section
              className="content-section ebook-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <span className="section-icon">📚</span>
                Ücretsiz E-Kitaplar
              </h2>
              <div className="ebook-container">
                {ebookContent.map((ebook, index) => (
                  <motion.div
                    className="ebook-card"
                    key={ebook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                  >
                    <div className="ebook-cover">
                      <img src={ebook.thumbnailUrl} alt={ebook.title} />
                    </div>
                    <div className="ebook-info">
                      <h3>{ebook.title}</h3>
                      <p>{ebook.description}</p>
                      <a onClick={() => handleClickDownloadFreeContentItem(ebook.contentUrl)} >
                        <button className="download-btn">
                          <span className="btn-icon">📥</span>
                          PDF İndir
                        </button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Webinar Section */}
          {webinarContent.length > 0 && (
            <motion.section
              className="content-section webinar-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <span className="section-icon">🔴</span>
                Yaklaşan Ücretsiz Webinarlar
              </h2>
              <div className="webinar-container">
                {webinarContent.map((webinar, index) => {
                  const { day, month } = formatDate(webinar.eventDate);
                  return (
                    <motion.div
                      className="webinar-card"
                      key={webinar.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                    >
                      <div className="webinar-date-badge">
                        <div className="date-day">{day}</div>
                        <div className="date-month">{month}</div>
                      </div>
                      <div className="webinar-info">
                        <h3>{webinar.title}</h3>
                        <p>{webinar.description}</p>
                        <button
                          className="register-btn"
                          onClick={() => openWebinarModal(webinar)}
                        >
                          <span className="btn-icon">✅</span>
                          Kaydol
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Resources Section */}
          {resourceContent.length > 0 && (
            <motion.section
              className="content-section resources-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <span className="section-icon">📁</span>
                İndirebileceğiniz Kaynaklar
              </h2>
              <div className="resources-container">
                {resourceContent.map((resource, index) => (
                  <motion.div
                    className="resource-card"
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                  >
                    <div className="resource-thumbnail">
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                      />
                    </div>
                    <div className="resource-info">
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <button
                        className="download-btn"
                        onClick={() => handleClickDownloadFreeContentItem(resource.contentUrl)}
                      >
                        <span className="btn-icon">📥</span>
                        İndir
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        <motion.section
          className="contact-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact-container">
            <div className="contact-info">
              <h2>Bize Ulaşın</h2>
              <p>Sorularınız veya geri bildirimleriniz için formu doldurun.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-posta Adresi</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mesajınız</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sorunuzu veya görüşünüzü yazın"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                <span className="btn-icon">📨</span>
                Gönder
              </button>
              {formSubmitted && (
                <motion.p
                  className="success-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Mesajınız gönderildi. Teşekkür ederiz!
                </motion.p>
              )}
            </form>
          </div>
        </motion.section>

        {/* Webinar Detail Modal */}
        {isModalOpen && selectedWebinar && (
          <div className="modal-overlay" onClick={closeModal}>
            <motion.div
              className="webinar-modal"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button className="modal-close-btn" onClick={closeModal}>×</button>

              <div className="modal-content">
                <div className="modal-header">
                  <h2>{selectedWebinar.title}</h2>
                  <div className="webinar-date-info">
                    <span className="calendar-icon">📅</span>
                    <span>{new Date(selectedWebinar.eventDate).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {selectedWebinar.thumbnailUrl && (
                  <div className="modal-image">
                    <img src={selectedWebinar.thumbnailUrl} alt={selectedWebinar.title} />
                  </div>
                )}

                <div className="modal-description">
                  <h3>Webinar Detayları</h3>
                  <p>{selectedWebinar.description}</p>
                </div>

                <div className="modal-registration">
                  <h3>Webinara Katılım</h3>
                  <form className="registration-form">
                    <div className="form-group">
                      <label htmlFor="register-name">Ad Soyad</label>
                      <input type="text" id="register-name" placeholder="Adınız ve soyadınız" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-email">E-posta Adresi</label>
                      <input type="email" id="register-email" placeholder="E-posta adresiniz" required />
                    </div>

                    <a
                      href={selectedWebinar.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-register-btn"
                    >
                      Webinara Kaydol
                    </a>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
      <Newslatter2 />
      <Footer />
    </>
  );
}

export default FreeContent;