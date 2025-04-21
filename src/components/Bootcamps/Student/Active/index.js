import React, { useState, useEffect } from 'react'
import { useGetActiveBootcampQuery } from '../../../../api/bootcampApi'
import './styles.css'
import Navbar from '../../../Navbar/Navbar'
import Footer from '../../../footer/Footer'
import { useNavigate } from 'react-router-dom'
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
                                        <span>Başlangıç: {formatDate(bootcamp.start_Date)}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="far fa-clock"></i>
                                        <span>{duration} gün</span>
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
        <Footer/>
        </>
    )
}

export default ActiveBootcamps