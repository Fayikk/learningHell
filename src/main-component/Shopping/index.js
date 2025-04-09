import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import './style.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
const Shopping = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    
    useEffect(() => {
        // In a real application, this would be an API call
        const fetchProducts = () => {
            setIsLoading(true);
            
            // Sample product data
            const dummyProducts = [
                {
                    id: 1,
                    name: "Elegance Tote Bag",
                    price: 249.99,
                    category: "bag",
                    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "A stylish tote bag perfect for everyday use."
                },
                {
                    id: 2,
                    name: "Premium Laptop Case",
                    price: 129.99,
                    category: "case",
                    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Protect your laptop in style with this premium case."
                },
                {
                    id: 3,
                    name: "Designer Watch",
                    price: 349.99,
                    category: "accessory",
                    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "A luxury watch to complement your style."
                },
                {
                    id: 4,
                    name: "Leather Backpack",
                    price: 199.99,
                    category: "bag",
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Durable and fashionable backpack for everyday use."
                },
                {
                    id: 5,
                    name: "Phone Case",
                    price: 39.99,
                    category: "case",
                    image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Stylish protection for your smartphone."
                },
                {
                    id: 6,
                    name: "Silver Necklace",
                    price: 89.99,
                    category: "accessory",
                    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Elegant silver necklace for any occasion."
                },
                {
                    id: 7,
                    name: "Crossbody Bag",
                    price: 159.99,
                    category: "bag",
                    image: "https://images.unsplash.com/photo-1598532213005-067bc5c952c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Compact and stylish crossbody bag."
                },
                {
                    id: 8,
                    name: "Tablet Sleeve",
                    price: 49.99,
                    category: "case",
                    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Protective sleeve for your tablet."
                },
                {
                    id: 9,
                    name: "Designer Sunglasses",
                    price: 159.99,
                    category: "accessory",
                    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Stylish sunglasses for the perfect summer look."
                },
                {
                    id: 10,
                    name: "Travel Duffel Bag",
                    price: 189.99,
                    category: "bag",
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Spacious duffel bag for all your travel needs."
                },
                {
                    id: 11,
                    name: "Camera Case",
                    price: 79.99,
                    category: "case",
                    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Protect your photography equipment."
                },
                {
                    id: 12,
                    name: "Leather Wallet",
                    price: 69.99,
                    category: "accessory",
                    image: "https://images.unsplash.com/photo-1517254797898-6edab341c033?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Premium quality leather wallet."
                },
                {
                    id: 13,
                    name: "Vintage Handbag",
                    price: 219.99,
                    category: "bag",
                    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Elegant vintage-style handbag."
                },
                {
                    id: 14,
                    name: "Tablet Folio Case",
                    price: 59.99,
                    category: "case",
                    image: "https://images.unsplash.com/photo-1544117519-31a4d87fcb2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                    description: "Professional folio case for your tablet."
                }
            ];
            
            setProducts(dummyProducts);
            setFilteredProducts(dummyProducts);
            setIsLoading(false);
        };
        
        fetchProducts();
    }, []);
    
    const filterProducts = (category) => {
        setActiveCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
        
        if (category === 'all') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.category === category);
            setFilteredProducts(filtered);
        }
    };
    
    const handleAddToCart = (product) => {
        // In a real app, this would add the product to a cart
        console.log("Added to cart:", product);
        alert(`${product.name} added to cart!`);
    };
    
    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Generate page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }
    
    return (
        <>
        <Navbar />
        <div className="shopping-page">
            <div className="shopping-banner">
                <div className="banner-content">
                    <h1>Stylish Accessories Collection</h1>
                    <p>Discover our premium selection of bags, cases, and accessories</p>
                </div>
            </div>
            
            <Container>
                <div className="category-filter">
                    <h2>Our Products</h2>
                    <div className="filter-buttons">
                        <button 
                            className={activeCategory === 'all' ? 'active' : ''}
                            onClick={() => filterProducts('all')}
                        >
                            All Products
                        </button>
                        <button 
                            className={activeCategory === 'bag' ? 'active' : ''}
                            onClick={() => filterProducts('bag')}
                        >
                            Bags
                        </button>
                        <button 
                            className={activeCategory === 'case' ? 'active' : ''}
                            onClick={() => filterProducts('case')}
                        >
                            Cases
                        </button>
                        <button 
                            className={activeCategory === 'accessory' ? 'active' : ''}
                            onClick={() => filterProducts('accessory')}
                        >
                            Accessories
                        </button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="loading">Loading products...</div>
                ) : (
                    <Row className="product-grid" >
                        {currentProducts.map(product => (
                            <Col md={3} sm={6} key={product.id} className="product-col" onClick={()=>navigate(`/Shopping/Detail/${product.id}`)} >
                                <div className="product-card">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-price">${product.price.toFixed(2)}</div>
                                        <button 
                                            className="add-to-cart" 
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                
                {filteredProducts.length === 0 && !isLoading && (
                    <div className="no-products">
                        <p>No products found in this category.</p>
                    </div>
                )}
                
                {/* Pagination */}
                {filteredProducts.length > 0 && !isLoading && (
                    <div className="pagination-container">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    onClick={() => paginate(currentPage - 1)} 
                                    className="page-link"
                                    disabled={currentPage === 1}
                                >
                                    &laquo; Prev
                                </button>
                            </li>
                            
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button 
                                        onClick={() => paginate(number)} 
                                        className="page-link"
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                <button 
                                    onClick={() => paginate(currentPage + 1)}
                                    className="page-link"
                                    disabled={currentPage === pageNumbers.length}
                                >
                                    Next &raquo;
                                </button>
                            </li>
                        </ul>
                        <div className="pagination-info">
                            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                        </div>
                    </div>
                )}
            </Container>
        </div>
        <Footer />
        </>
    );
};

export default Shopping;
