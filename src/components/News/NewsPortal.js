import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, InputGroup, FormControl, Button, Spinner, Nav } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  useGetLatestNewsQuery, 
  useGetNewsBySlugQuery,
  useGetNewsByCategoryQuery,
  useGetTrendingNewsQuery,
  useIncrementViewCountMutation,
  useSearchNewsQuery
} from '../../api/newsApi';
import { useGetAllTagsQuery } from '../../api/tagsApi';
import { FaSearch, FaEye, FaCalendarAlt, FaTag, FaChevronRight } from 'react-icons/fa';
import './style/News.css'; // We'll create this later
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';
import DOMPurify from 'dompurify';
const NewsPortal = () => {
  // Router hooks
  const { slug, category } = useParams();
  const navigate = useNavigate();
  
  // Local states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  
  // RTK Query hooks - only fetch data based on current view
  const { data: latestNews = [], isLoading: isLatestLoading } = useGetLatestNewsQuery(
    10, { skip: slug || (category && activeTab !== 'latest') }
  );
  const { data: trendingNews = [], isLoading: isTrendingLoading } = useGetTrendingNewsQuery(
    5, { skip: slug || (category && activeTab !== 'trending') }
  );
  const { data: searchResults = [], isLoading: isSearchLoading } = useSearchNewsQuery(
    searchTerm, { skip: !searchTerm || slug || category }
  );
  const { data: categoryNews = [], isLoading: isCategoryLoading } = useGetNewsByCategoryQuery(
    category, { skip: !category || slug }
  );
  const { data: singleNews, isLoading: isSingleLoading } = useGetNewsBySlugQuery(
    slug, { skip: !slug }
  );
  const { data: popularTags = [] } = useGetAllTagsQuery({ skip: false });
  
  // Mutations
  const [incrementView] = useIncrementViewCountMutation();

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/news/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };


  useEffect(() => {
    // HTML etiketlerini ve özelliklerini güvenli hale getirmek için DOMPurify'ı yapılandırın
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      // Tüm img etiketlerine sınıflar ekleyin
      if (node.tagName === 'IMG') {
        node.setAttribute('class', 'img-fluid rounded');
      }
      
      // Tüm bağlantıları yeni sekmede açın ve güvenlik ekleyin
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, []);

  const sanitizeContent = (html) => {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'br', 'a', 'img', 'strong', 'em', 'blockquote', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
      ADD_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
    });
  };



  // Increment view count when reading an article
  useEffect(() => {
    if (singleNews?.id) {
      incrementView(singleNews.id);
    }
  }, [singleNews?.id, incrementView]);

  // Categories for navigation
  const categories = [
    { value: 0, label: 'Sport' },
    { value: 1, label: 'Economy' },
    { value: 2, label: 'Technology' },
    { value: 3, label: 'Health' },
    { value: 4, label: 'Politics' }
  ];

  // Determine which news list to show
  const getDisplayedNews = () => {
    if (slug) return null; // On article detail page
    if (category) return categoryNews;
    if (searchTerm && searchResults.length > 0) return searchResults;
    return activeTab === 'trending' ? trendingNews : latestNews;
  };

  // Loading state
  const isLoading = isSingleLoading || isLatestLoading || isTrendingLoading || 
                    isSearchLoading || isCategoryLoading;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // News article card component
  const NewsCard = ({ article }) => (
    <Card className="mb-4 news-card">
      <div className="news-img-container">
        {article.imageUrl && (
          <Card.Img 
            variant="top" 
            src={article.imageUrl} 
            alt={article.title} 
            className="news-card-img" 
          />
        )}
        <Badge bg="primary" className="category-badge">
          {categories.find(c => c.value === article.category)?.label || 'General'}
        </Badge>
      </div>
      <Card.Body>
        <Card.Title className="news-title">
          <Link to={`/news/${article.slug}`} className="title-link">
            {article.title}
          </Link>
        </Card.Title>
        <div className="news-meta">
          <span><FaCalendarAlt /> {formatDate(article.createdAt || new Date())}</span>
          <span><FaEye /> {article.viewCount || 0}</span>
        </div>
        <Card.Text className="news-summary">
          {article.summary}
        </Card.Text>
        <div className="news-tags">
          {article.tags?.slice(0, 3).map(tag => (
            <Badge bg="secondary" key={tag.id} className="me-1">
              <FaTag className="me-1" />
              {tag.name}
            </Badge>
          ))}
          {article.tags?.length > 3 && <Badge bg="light" text="dark">+{article.tags.length - 3}</Badge>}
        </div>
        <Link to={`/news/${article.slug}`} className="read-more">
          Read more <FaChevronRight size={12} />
        </Link>
      </Card.Body>
    </Card>
  );

  return (
    <>
    <Navbar></Navbar>
    <Container className="py-4 news-portal">
      <Row>
        <Col lg={8}>
          {/* Main Content */}
          {slug && singleNews ? (
            // Single Article View
            <div className="single-news">
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <h1 className="article-title">{singleNews.title}</h1>
                  <div className="article-meta">
                    <span className="category">
                      {categories.find(c => c.value === singleNews.category)?.label || 'General'}
                    </span>
                    <span className="date">
                      <FaCalendarAlt /> {formatDate(singleNews.createdAt || new Date())}
                    </span>
                    <span className="views">
                      <FaEye /> {singleNews.viewCount || 0} views
                    </span>
                  </div>
                  
                  {singleNews.imageUrl && (
                    <div className="article-image">
                      <img 
                        src={singleNews.imageUrl} 
                        alt={singleNews.title} 
                        className="img-fluid rounded" 
                      />
                    </div>
                  )}
                  
                  <div className="article-tags mb-4">
                    {singleNews.tags?.map(tag => (
                      <Badge bg="secondary" key={tag.id} className="me-1">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div 
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeContent(singleNews.content) }}
                  />
                </>
              )}
            </div>
          ) : (
            // Articles List View
            <>
              {!category && !searchTerm && (
                <Nav 
                  variant="tabs" 
                  activeKey={activeTab} 
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4 news-tabs"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="latest">Latest News</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="trending">Trending</Nav.Link>
                  </Nav.Item>
                </Nav>
              )}
              
              {searchTerm && (
                <h2 className="mb-4">Search Results for: "{searchTerm}"</h2>
              )}
              
              {category && (
                <h2 className="mb-4">{categories.find(c => c.value.toString() === category)?.label} News</h2>
              )}

              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="news-grid">
                  {getDisplayedNews()?.length > 0 ? (
                    getDisplayedNews().map(article => (
                      <NewsCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <h4>No articles found</h4>
                      <p>Try a different search or category.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Col>
        
        <Col lg={4}>
          {/* Sidebar */}
          <div className="sidebar">
            {/* Search Box */}
            <Card className="mb-4 sidebar-card">
              <Card.Body>
                <Card.Title>Search</Card.Title>
                <form onSubmit={handleSearch}>
                  <InputGroup>
                    <FormControl
                      placeholder="Search news..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </form>
              </Card.Body>
            </Card>

            {/* Categories */}
            <Card className="mb-4 sidebar-card">
              <Card.Body>
                <Card.Title>Categories</Card.Title>
                <Nav className="flex-column">
                  {categories.map(cat => (
                    <Nav.Link 
                      key={cat.value}
                      as={Link} 
                      to={`/news/category/${cat.value}`}
                      className="sidebar-link"
                    >
                      {cat.label}
                    </Nav.Link>
                  ))}
                </Nav>
              </Card.Body>
            </Card>

            {/* Popular Tags */}
            <Card className="mb-4 sidebar-card">
              <Card.Body>
                <Card.Title>Popular Tags</Card.Title>
                <div className="tag-cloud">
                  {popularTags.slice(0, 15).map(tag => (
                    <Link 
                      key={tag.id} 
                      to={`/news/tag/${tag.name}`}
                      className="tag-link"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Trending News (Sidebar) */}
            {!slug && activeTab !== 'trending' && (
              <Card className="sidebar-card">
                <Card.Body>
                  <Card.Title>Trending Now</Card.Title>
                  <div className="sidebar-news-list">
                    {trendingNews.slice(0, 5).map(article => (
                      <div key={article.id} className="sidebar-news-item">
                        <Link to={`/news/${article.slug}`}>
                          {article.imageUrl && (
                            <div className="sidebar-news-img">
                              <img src={article.imageUrl} alt={article.title} />
                            </div>
                          )}
                          <div className="sidebar-news-content">
                            <h6>{article.title}</h6>
                            <small>
                              <FaEye /> {article.viewCount || 0}
                            </small>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
<Footer></Footer>
    </>
  );
};

export default NewsPortal;