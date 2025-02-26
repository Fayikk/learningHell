import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Badge, Alert } from 'react-bootstrap';
import { useGetAllNewsQuery, useCreateNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } from '../../api/newsApi';
import { useGetAllTagsQuery } from '../../api/tagsApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewsManagement = () => {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    category: 0, // Integer value
    tags: []
  });
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', variant: '' });

  // API queries
  const { data: news = [], isLoading: isLoadingNews, refetch: refetchNews } = useGetAllNewsQuery();
  const { data: tags = [] } = useGetAllTagsQuery();
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();

  // Filter news based on search term
  const filteredNews = searchTerm
    ? news.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : news;
    
  // Category options
  const categories = [
    { value: 0, label: 'Sport' },
    { value: 1, label: 'Economy' },
    { value: 2, label: 'Technology' },
    { value: 3, label: 'Health' },
    { value: 4, label: 'Politics' }
  ];

  // Show alert
  const showAlert = (message, variant) => {
    setAlertInfo({ show: true, message, variant });
    setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
  };

  // Handle input change - Modified to handle category as integer
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert category to integer
    if (name === 'category') {
      setNewsForm({ ...newsForm, [name]: parseInt(value, 10) });
    } else {
      setNewsForm({ ...newsForm, [name]: value });
    }
  };

  // Handle editor change
  const handleEditorChange = (content) => {
    setNewsForm({ ...newsForm, content });
  };

  // Handle tag toggle
  const handleTagToggle = (tagId) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;

    const newTags = newsForm.tags.some(t => t.id === tagId)
      ? newsForm.tags.filter(t => t.id !== tagId)
      : [...newsForm.tags, tag];

    setNewsForm({ ...newsForm, tags: newTags });
  };

  // Open create modal
  const handleCreateNews = () => {
    setFormMode('create');
    setNewsForm({
      title: '',
      content: '',
      summary: '',
      imageUrl: '',
      category: 0, // Make sure it's an integer
      tags: []
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEditNews = (news) => {
    setFormMode('edit');
    setSelectedNews(news);
    setNewsForm({
      title: news.title || '',
      content: news.content || '',
      summary: news.summary || '',
      imageUrl: news.imageUrl || '',
      category: typeof news.category === 'number' ? news.category : 0, // Ensure it's an integer
      tags: news.tags || []
    });
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure category is an integer before submitting
      const formDataToSubmit = {
        ...newsForm,
        category: parseInt(newsForm.category, 10)
      };
      
      if (formMode === 'create') {
        await createNews(formDataToSubmit).unwrap();
        showAlert('News created successfully', 'success');
      } else {
        await updateNews({ 
          id: selectedNews.id, 
          ...formDataToSubmit
        }).unwrap();
        showAlert('News updated successfully', 'success');
      }
      
      setShowModal(false);
      refetchNews();
    } catch (error) {
      console.error('API Error:', error);
      showAlert(`Error: ${error.data?.message || 'Something went wrong'}`, 'danger');
    }
  };

  // Delete news
  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteNews(id).unwrap();
        showAlert('News deleted successfully', 'success');
        refetchNews();
      } catch (error) {
        showAlert(`Error: ${error.data?.message || 'Something went wrong'}`, 'danger');
      }
    }
  };

  // Log before rendering to check the category value type
  console.log('Current newsForm:', newsForm);

  return (
    <Container className="py-4">
      <h1 className="mb-4">News Management</h1>

      {/* Alert */}
      {alertInfo.show && (
        <Alert variant={alertInfo.variant} onClose={() => setAlertInfo({...alertInfo, show: false})} dismissible>
          {alertInfo.message}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">News Articles</h5>
          <div>
            <Button variant="success" onClick={handleCreateNews}>+ Create News</Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Search */}
          <Form.Group className="mb-3">
            <Form.Control 
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {/* News Table */}
          {isLoadingNews ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.length > 0 ? (
                    filteredNews.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{categories.find(c => c.value === item.category)?.label || 'Unknown'}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {item.tags?.map(tag => (
                              <Badge bg="secondary" key={tag.id}>{tag.name}</Badge>
                            ))}
                          </div>
                        </td>
                        <td>{item.viewCount}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleEditNews(item)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteNews(item.id)}
                            disabled={isDeleting}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No news articles found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* News Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === 'create' ? 'Create News Article' : 'Edit News Article'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newsForm.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Summary */}
            <Form.Group className="mb-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="summary"
                value={newsForm.summary}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Image URL */}
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={newsForm.imageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                {/* Category */}
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={newsForm.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                  {/* Display the current category value and type for debugging */}
                  <small className="text-muted">
                    Category value: {newsForm.category} (type: {typeof newsForm.category})
                  </small>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Tags */}
                <Form.Group>
                  <Form.Label>Tags</Form.Label>
                  <div className="border p-2 rounded" style={{height: '100px', overflowY: 'auto'}}>
                    {tags?.map(tag => (
                      <Form.Check
                        key={tag.id}
                        type="checkbox"
                        label={tag.name}
                        checked={newsForm.tags.some(t => t.id === tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Content */}
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <ReactQuill 
                value={newsForm.content} 
                onChange={handleEditorChange}
                style={{height: '200px', marginBottom: '50px'}}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <><Spinner size="sm" animation="border" /> Saving...</>
              ) : (
                'Save'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default NewsManagement;