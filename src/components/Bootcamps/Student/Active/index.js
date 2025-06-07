import React, { useState, useEffect } from 'react'
import { useGetActiveBootcampQuery } from '../../../../api/bootcampApi'
import './styles.css'
import Navbar from '../../../Navbar/Navbar'
import Footer from '../../../footer/Footer'
import { useNavigate } from 'react-router-dom'
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  );
function ActiveBootcamps() {
    const {data, isLoading, isError} = useGetActiveBootcampQuery()
    const [filteredBootcamps, setFilteredBootcamps] = useState([]);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        isOnline: 'all',
        priceRange: 'all',
        searchTerm: ''
    });
    
    useEffect(() => {
        
        if (data?.result) {
            console.log("trigger data",data.result)
            // Deep copy data to ensure no reference problems
            let filtered = JSON.parse(JSON.stringify(data.result));
            
            // Apply online/offline filter
            if (filters.isOnline !== 'all') {
                const isOnlineValue = filters.isOnline === 'online';
                filtered = filtered.filter(bootcamp => {
                    // Convert to boolean to ensure proper comparison
                    const bootcampIsOnline = Boolean(bootcamp.isOnline);
                    return bootcampIsOnline === isOnlineValue;
                });
            }
            
            // Apply price filter
            if (filters.priceRange !== 'all') {
                if (filters.priceRange === 'free') {
                    filtered = filtered.filter(bootcamp => {
                        // Ensure price is treated as a number
                        const price = typeof bootcamp.price === 'string' ? 
                            parseFloat(bootcamp.price) : Number(bootcamp.price);
                        return price === 0;
                    });
                } else if (filters.priceRange === 'paid') {
                    filtered = filtered.filter(bootcamp => {
                        const price = typeof bootcamp.price === 'string' ? 
                            parseFloat(bootcamp.price) : Number(bootcamp.price);
                        return price > 0;
                    });
                } else if (filters.priceRange === 'low') {
                    filtered = filtered.filter(bootcamp => {
                        const price = typeof bootcamp.price === 'string' ? 
                            parseFloat(bootcamp.price) : Number(bootcamp.price);
                        return price > 0 && price <= 1000;
                    });
                } else if (filters.priceRange === 'high') {
                    filtered = filtered.filter(bootcamp => {
                        const price = typeof bootcamp.price === 'string' ? 
                            parseFloat(bootcamp.price) : Number(bootcamp.price);
                        return price > 1000;
                    });
                }
            }
            
            // Apply search filter
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase().trim();
                filtered = filtered.filter(bootcamp => {
                    const title = bootcamp.title || '';
                    const desc = bootcamp.short_Description || '';
                    return title.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
                });
            }
            
            setFilteredBootcamps(filtered);
        }
    }, [data, filters]);

    if (isLoading) {
        return <div className="loading-container"><div className="loader"></div></div>
    }

    if (isError) {
        return <div className="error-message">Bootcamp bilgileri yüklenirken bir hata oluştu.</div>
    }

    const bootcamps = filteredBootcamps.length > 0 ? filteredBootcamps : (data?.result || []);

    if (bootcamps.length === 0) {
        return (
            <>
                <Navbar />
                <div className="bootcamps-empty-container">
                    <div className="empty-state">
                        <i className="fas fa-school empty-icon"></i>
                        <h2>Şu anda aktif bootcamp bulunmamaktadır</h2>
                        <p>Daha sonra tekrar kontrol ediniz veya filtrelerinizi değiştiriniz.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR');
        } catch {
            return dateString;
        }
    };

    const handleFilterChange = (filterName, value) => {
        console.log(`Changing filter ${filterName} to:`, value);
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };


    const goToDetailPage = (slug) => {
        navigate(`/Bootcamp/Detail/${slug}`);
    }

    return (
        <>
        <Navbar/>
        <div className="bootcamps-hero">
            <div className="hero-content">
                <h1>Bootcamp'leri Keşfet</h1>
                <p>Kariyerine yön verecek onlarca bootcamp seni bekliyor.</p>
            </div>
        </div>
        
        <div className="bootcamps-container">
            <div className="filters-section">
                <div className="search-filter">
                    <input 
                        type="text" 
                        placeholder="Bootcamp adı veya açıklama ara..." 
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </div>
                
                <div className="filter-options">
                    <div className="filter-group">
                        <label>Format:</label>
                        <select 
                            value={filters.isOnline} 
                            onChange={(e) => handleFilterChange('isOnline', e.target.value)}
                        >
                            <option value="all">Tümü</option>
                            <option value="online">Online</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Fiyat:</label>
                        <select 
                            value={filters.priceRange} 
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        >
                            <option value="all">Tümü</option>
                          
                            <option value="low">₺1000 ve altı</option>
                            <option value="high">₺1000 üzeri</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="bootcamps-grid">
                {bootcamps.map(bootcamp => {
                    const duration = calculateDuration(bootcamp.start_Date, bootcamp.end_Date);
                    
                    return (
                        <div className="bootcamp-card" key={bootcamp.id}>
                            <div className="bootcamp-image">
                                <img src={bootcamp.thumbnail_Url || '/placeholder-bootcamp.jpg'} alt={bootcamp.title} />
                                <div className="bootcamp-badges">
                                    <span className={`badge ${bootcamp.isOnline ? 'online' : 'offline'}`}>
                                        {bootcamp.isOnline ? 'Online' : 'Yüz yüze'}
                                    </span>
                                    {Number(bootcamp.price) === 0 && (
                                        <span className="badge free">Ücretsiz</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bootcamp-content">
                                <h2 className="bootcamp-title">{bootcamp.title}</h2>
                                <div className="bootcamp-description-container">
                                    <p className="bootcamp-description">{bootcamp.short_Description}</p>
                                </div>
                                
                                <div className="bootcamp-meta">
                                    <div className="meta-item">
                                        <i className="far fa-calendar-alt"></i>
                                        <span>Süre: 8 - 14 HAFTA</span>
                                    </div>
                                  
                                    {Number(bootcamp.price) > 0 && (
                                        <div className="meta-item price">
                                            <span>{Number(bootcamp.price).toLocaleString('tr-TR')} ₺</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bootcamp-topics-container">
                                    {bootcamp.bootcampTopics && bootcamp.bootcampTopics.length > 0 && (
                                        <div className="bootcamp-topics">
                                            {bootcamp.bootcampTopics.slice(0, 3).map(topic => (
                                                <span className="topic-tag" key={topic.id}>{topic.title}</span>
                                            ))}
                                            {bootcamp.bootcampTopics.length > 3 && (
                                                <span className="topic-tag more">+{bootcamp.bootcampTopics.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bootcamp-actions">
                                    <button className="btn-details" onClick={()=>goToDetailPage(bootcamp.slug)} >Detayları Gör</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="whatsapp-container">
  <div className="whatsapp-promo">Bizimle İletişime Geç İndirimi Yakala!</div>
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

        <Footer/>
        </>
    )
}

export default ActiveBootcamps