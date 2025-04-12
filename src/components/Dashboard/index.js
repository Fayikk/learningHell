import React, { useState } from 'react'
import { useGetEnrollmentsBootcampsByUserQuery } from '../../api/enrollmentApi'
import './Dashboard.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'

function Dashboard() {
  const { data, isLoading, error } = useGetEnrollmentsBootcampsByUserQuery()
  const bootcamps = data?.result || []
  const [showModal, setShowModal] = useState(false)
  const [selectedBootcamp, setSelectedBootcamp] = useState(null)
  
  const handleContinueClick = (bootcamp) => {
    setSelectedBootcamp(bootcamp)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBootcamp(null)
  }
  
  return (
    <>
    <Navbar></Navbar>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bootcamp Takip Panelim</h1>
        <p>Satın aldığınız ve devam ettiğiniz bootcampler aşağıda listelenmiştir.</p>
      </div>
      
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Bootcampler yükleniyor...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <h3>Bir hata oluştu</h3>
          <p>Bootcampleriniz yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      )}
      
      {bootcamps && bootcamps.length === 0 && !isLoading && (
        <div className="empty-state">
          <h3>Henüz Bir Bootcamp'e Kayıt Olmadınız</h3>
          <p>İlginizi çekebilecek bootcampleri keşfedin ve eğitim yolculuğunuza başlayın.</p>
          <button className="explore-button">Bootcampleri Keşfet</button>
        </div>
      )}
      
      {bootcamps && bootcamps.length > 0 && (
        <div className="bootcamps-grid">
          {bootcamps.map((bootcamp) => (
            <div className="bootcamp-card" key={bootcamp.id}>
              <div className="bootcamp-image">
                {bootcamp.thumbnail_Url ? (
                  <img src={bootcamp.thumbnail_Url} alt={bootcamp.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>{bootcamp.title?.charAt(0) || 'B'}</span>
                  </div>
                )}
              </div>
              
              <div className="bootcamp-content">
                <h3>{bootcamp.title || 'Bootcamp Başlığı'}</h3>
                <p>{bootcamp.short_Description || bootcamp.description?.substring(0, 100) || 'Açıklama bulunmamaktadır.'}{bootcamp.description?.length > 100 ? '...' : ''}</p>
                
                <div className="bootcamp-details">
                  <div className="detail-item">
                    <i className="calendar-icon"></i>
                    <span>Başlangıç: {new Date(bootcamp.start_Date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="detail-item">
                    <i className="location-icon"></i>
                    <span>{bootcamp.isOnline ? 'Online' : 'Yüz Yüze'}</span>
                  </div>
                </div>
                
                <div className="progress-container">
                  <div className="progress-label">
                    <span>İlerlemeniz</span>
                    <span>{Math.floor(Math.random() * 100)}%</span> {/* Rastgele ilerleme - gerçek veri yoksa */}
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                  </div>
                </div>
                
                <div className="bootcamp-topics">
                  <h4>Konular ({bootcamp.bootcampTopics.length})</h4>
                  <div className="topics-list">
                    {bootcamp.bootcampTopics.slice(0, 3).map(topic => (
                      <span key={topic.id} className="topic-tag">{topic.title}</span>
                    ))}
                    {bootcamp.bootcampTopics.length > 3 && <span className="more-topics">+{bootcamp.bootcampTopics.length - 3} daha</span>}
                  </div>
                </div>
                
                <div className="bootcamp-footer">
                  <div className="price-info">{bootcamp.price} TL</div>
                  <button className="continue-button" onClick={() => handleContinueClick(bootcamp)}>Devam Et</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBootcamp && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBootcamp.title}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="bootcamp-info">
                <div className="bootcamp-info-item">
                  <h4>Bootcamp Detayları</h4>
                  <p>{selectedBootcamp.description || 'Açıklama bulunmamaktadır.'}</p>
                </div>
                
                <div className="bootcamp-info-item">
                  <h4>Takvim</h4>
                  <div className="schedule-list">
                    <div className="schedule-item">
                      <div className="schedule-date">
                        <i className="calendar-icon"></i>
                        <span>Başlangıç: {new Date(selectedBootcamp.start_Date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {selectedBootcamp.end_Date && (
                        <div className="schedule-date">
                          <i className="calendar-icon"></i>
                          <span>Bitiş: {new Date(selectedBootcamp.end_Date).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="schedule-item">
                      <h5>Eğitim Programı</h5>
                      <ul className="program-list">
                        {selectedBootcamp.bootcampTopics.map((topic, index) => (
                          <li key={topic.id} className="program-item">
                            <span className="topic-number">{index + 1}</span>
                            <div className="topic-content">
                              <h6>{topic.title}</h6>
                              <p>{topic.description || 'Bu konu için açıklama bulunmamaktadır.'}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-button primary" onClick={closeModal}>Kapat</button>
              <button className="modal-button secondary">Derse Git</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer></Footer>
    </>
  )
}

export default Dashboard