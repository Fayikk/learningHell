import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Slider from "react-slick";
import { FaPlus, FaMinus, FaShoppingCart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './style.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';

const ShoppingDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Dummy product data
    const product = {
        id: 1,
        name: "Premium Learning Course",
        price: 249.99,
        discountPrice: 199.99,
        rating: 4.5,
        reviewCount: 124,
        description: "This comprehensive course provides in-depth knowledge and practical skills to master the subject. Perfect for beginners and advanced learners alike.",
        features: [
            "24/7 lifetime access",
            "Downloadable resources",
            "Certificate upon completion",
            "Expert instructor support"
        ],
        images: [
            "/assets/images/product-1.jpg",
            "/assets/images/product-2.jpg",
            "/assets/images/product-3.jpg",
            "/assets/images/product-4.jpg",
            "/assets/images/product-5.jpg",
        ],
        inStock: true,
        category: "Education"
    };

    // Settings for main image slider
    const mainSliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: current => setSelectedImage(current),
        arrows: true,
        autoplay: false,
        className: "product-main-slider"
    };

    // Settings for thumbnail slider
    const thumbnailSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        arrows: true,
        className: "product-thumbnail-slider",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            }
        ]
    };

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
    };

    // Add to cart function
    const handleAddToCart = () => {
        alert(`Added ${quantity} item(s) to cart!`);
        // Here you would add the actual cart functionality
    };

    // Generate stars for rating
    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="star-filled" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="star-filled" />);
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaStar key={`empty-star-${i}`} className="star-empty" />);
        }

        return stars;
    };

    return (
        <>
        <Navbar></Navbar>
        <section className="product-detail-section">
            <Container>
                <div className="product-details-wrapper">
                    <Row>
                        <Col lg={6} md={6} className="product-gallery-col">
                            <div className="product-gallery">
                                <div className="main-image-container">
                                    <Slider {...mainSliderSettings}>
                                        {product.images.map((image, index) => (
                                            <div className="main-slide-item" key={index}>
                                                <img src={image} alt={`${product.name} view ${index + 1}`} />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="thumbnail-container">
                                    <Slider {...thumbnailSettings}>
                                        {product.images.map((image, index) => (
                                            <div 
                                                className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`} 
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </Col>
                        
                        <Col lg={6} md={6} className="product-info-col">
                            <div className="product-info">
                                <div className="product-category">{product.category}</div>
                                <h2 className="product-title">{product.name}</h2>
                                
                                <div className="product-rating">
                                    <div className="stars">
                                        {renderRatingStars(product.rating)}
                                    </div>
                                    <span className="rating-count">({product.reviewCount} reviews)</span>
                                </div>
                                
                                <div className="product-price">
                                    {product.discountPrice ? (
                                        <>
                                            <span className="current-price">${product.discountPrice.toFixed(2)}</span>
                                            <span className="old-price">${product.price.toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="current-price">${product.price.toFixed(2)}</span>
                                    )}
                                </div>
                                
                                <div className="product-description">
                                    <p>{product.description}</p>
                                </div>
                                
                                <div className="product-features">
                                    <h4>Key Features:</h4>
                                    <ul>
                                        {product.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="product-stock-status">
                                    <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                
                                <div className="product-actions">
                                    <div className="quantity-selector">
                                        <button 
                                            className="quantity-btn minus" 
                                            onClick={decreaseQuantity} 
                                            disabled={quantity <= 1}
                                        >
                                            <FaMinus />
                                        </button>
                                        <input 
                                            type="number" 
                                            className="quantity-input" 
                                            value={quantity} 
                                            readOnly 
                                        />
                                        <button 
                                            className="quantity-btn plus" 
                                            onClick={increaseQuantity}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    
                                    <Button 
                                        className="add-to-cart-btn" 
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
       <Footer></Footer>
        </>
    );
};

export default ShoppingDetail;
