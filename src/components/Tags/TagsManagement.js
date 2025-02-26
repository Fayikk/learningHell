import React, { useState, useEffect } from 'react';
import { 
  useGetAllTagsQuery, 
  useGetPopularTagsQuery,
  useCreateTagMutation, 
  useUpdateTagMutation, 
  useDeleteTagMutation,
  useGetTagsByNewsIdQuery,
  useAddTagToNewsMutation,
  useRemoveTagFromNewsMutation
} from '../../api/tagsApi';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  InputGroup, 
  Table, 
  Badge, 
  Modal, 
  Alert,
  ListGroup,
  Spinner
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaLink, FaUnlink, FaSearch } from 'react-icons/fa';

const TagsManagement = () => {
  // State for tag operations
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsId, setNewsId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // RTK Query hooks
  const { data: allTags = [], isLoading: isLoadingTags, refetch: refetchAllTags } = useGetAllTagsQuery();
  const { data: popularTags = [] } = useGetPopularTagsQuery(5);
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();
  
  // News-related tag hooks
  const { data: newsTagsData, isLoading: isLoadingNewsTags } = useGetTagsByNewsIdQuery(newsId, { 
    skip: !newsId 
  });
  const [addTagToNews, { isLoading: isAddingToNews }] = useAddTagToNewsMutation();
  const [removeTagFromNews, { isLoading: isRemovingFromNews }] = useRemoveTagFromNewsMutation();

  // Filtered tags based on search term
  const filteredTags = searchTerm 
    ? allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allTags;

  // Handle create tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      await createTag({ name: newTagName });
      setNewTagName('');
      showNotification('Tag created successfully!', 'success');
    } catch (error) {
      showNotification(`Failed to create tag: ${error.message}`, 'danger');
    }
  };

  // Handle edit tag
  const handleEditTag = async () => {
    if (!editTagName.trim() || !selectedTag) return;
    
    try {
      await updateTag({ id: selectedTag.id, name: editTagName });
      setShowEditModal(false);
      showNotification('Tag updated successfully!', 'success');
    } catch (error) {
      showNotification(`Failed to update tag: ${error.message}`, 'danger');
    }
  };

  // Handle delete tag
  const handleDeleteTag = async () => {
    if (!selectedTag) return;
    
    try {
      await deleteTag(selectedTag.id);
      setShowDeleteModal(false);
      setSelectedTag(null);
      showNotification('Tag deleted successfully!', 'success');
    } catch (error) {
      showNotification(`Failed to delete tag: ${error.message}`, 'danger');
    }
  };

  // Handle add tag to news
  const handleAddTagToNews = async (tagId) => {
    if (!newsId || !tagId) return;
    
    try {
      await addTagToNews({ tagId, newsId });
      showNotification('Tag added to news successfully!', 'success');
    } catch (error) {
      showNotification(`Failed to add tag to news: ${error.message}`, 'danger');
    }
  };

  // Handle remove tag from news
  const handleRemoveTagFromNews = async (tagId) => {
    if (!newsId || !tagId) return;
    
    try {
      await removeTagFromNews({ tagId, newsId });
      showNotification('Tag removed from news successfully!', 'success');
    } catch (error) {
      showNotification(`Failed to remove tag from news: ${error.message}`, 'danger');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  // Open edit modal with selected tag
  const openEditModal = (tag) => {
    setSelectedTag(tag);
    setEditTagName(tag.name);
    setShowEditModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (tag) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4 text-center">Tags Management</h1>
      
      {/* Notification alert */}
      {notification.show && (
        <Alert variant={notification.type} dismissible onClose={() => setNotification({ ...notification, show: false })}>
          {notification.message}
        </Alert>
      )}

      <Row>
        {/* Left column: Tag list and search */}
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
              <h5 className="mb-0">All Tags</h5>
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => refetchAllTags()}
                disabled={isLoadingTags}
              >
                {isLoadingTags ? <Spinner animation="border" size="sm" /> : 'Refresh'}
              </Button>
            </Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {isLoadingTags ? (
                <div className="text-center p-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>News Count</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag, index) => (
                          <tr key={tag.id}>
                            <td>{index + 1}</td>
                            <td>{tag.name}</td>
                            <td>
                              {tag.news?.length || 0}
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => openEditModal(tag)}
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => openDeleteModal(tag)}
                              >
                                <FaTrash />
                              </Button>
                              {newsId && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  className="ms-1"
                                  onClick={() => handleAddTagToNews(tag.id)}
                                >
                                  <FaLink />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No tags found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* News-related tags section */}
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Tags by News Article</h5>
            </Card.Header>
            <Card.Body>
              <Form className="mb-3">
                <InputGroup>
                  <Form.Control
                    placeholder="Enter News ID to view/manage its tags"
                    value={newsId}
                    onChange={(e) => setNewsId(e.target.value)}
                  />
                  <Button variant="info" onClick={() => setNewsId(newsId)}>
                    Load Tags
                  </Button>
                </InputGroup>
              </Form>

              {newsId && (
                <>
                  <h6>Tags for News ID: {newsId}</h6>
                  {isLoadingNewsTags ? (
                    <div className="text-center p-3">
                      <Spinner animation="border" variant="info" />
                    </div>
                  ) : (
                    <ListGroup>
                      {newsTagsData?.length > 0 ? (
                        newsTagsData.map(tag => (
                          <ListGroup.Item key={tag.id} className="d-flex justify-content-between align-items-center">
                            {tag.name}
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleRemoveTagFromNews(tag.id)}
                              disabled={isRemovingFromNews}
                            >
                              <FaUnlink /> Remove
                            </Button>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item className="text-center">No tags associated with this news article</ListGroup.Item>
                      )}
                    </ListGroup>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right column: Create tag and popular tags */}
        <Col md={4}>
          {/* Create tag card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Create New Tag</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCreateTag}>
                <Form.Group className="mb-3">
                  <Form.Label>Tag Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100"
                  disabled={isCreating || !newTagName.trim()}
                >
                  {isCreating ? <Spinner animation="border" size="sm" /> : <><FaPlus /> Create Tag</>}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Popular tags card */}
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">Popular Tags</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {popularTags.map(tag => (
                  <Badge 
                    bg="secondary" 
                    key={tag.id}
                    className="p-2 fs-6"
                    onClick={() => setSearchTerm(tag.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag.name} {tag.news?.length > 0 && <span>({tag.news.length})</span>}
                  </Badge>
                ))}
              </div>
              <small className="text-muted">Click on a tag to search for it</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Tag Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type="text"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditTag}
            disabled={isUpdating || !editTagName.trim()}
          >
            {isUpdating ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the tag "{selectedTag?.name}"? 
          {selectedTag?.news?.length > 0 && (
            <Alert variant="warning" className="mt-2">
              This tag is used in {selectedTag.news.length} news articles. Deleting it may affect those articles.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteTag}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TagsManagement;