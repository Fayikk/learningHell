import React, { useState } from 'react';
import {
  Container,
  Tab,
  Tabs,
  Form,
  Button,
  Card,
  Row,
  Col,
  Table,
  Alert,
  Badge
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import Navbar from '../../../Navbar/Navbar';
import Footer from '../../../footer/Footer';
import { useCreateNewBootcampMutation, useGetAllBootcampByUserQuery } from '../../../../api/bootcampApi';
import { useCreateNewBootcampTopicMutation } from '../../../../api/bootcampTopicApi';
import { useCreateNewBootcampScheduleMutation } from '../../../../api/bootcampScheduleApi';
import {toast} from 'react-toastify';
import InstructorAuth from '../../../../Wrappers/HoC/InstructorAuth';

const InstructorBootcampManagement = () => {
  const [key, setKey] = useState('bootcamp');
  const [bootcampData, setBootcampData] = useState(null);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const {data:bootcampFetchData,error,isLoading} = useGetAllBootcampByUserQuery();
  const [createNewBootcamp] = useCreateNewBootcampMutation();
  const [createNewBootcampTopic] = useCreateNewBootcampTopicMutation();
  const [createNewBootcampSchedule] = useCreateNewBootcampScheduleMutation();

  // Validation schemas
  const bootcampValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    slug: Yup.string().required('Slug is required'),
    short_Description: Yup.string().required('Short description is required'),
    description: Yup.string().required('Description is required'),
    thumbnail_Url: Yup.string().url('Must be a valid URL').required('Thumbnail URL is required'),
    price: Yup.number().min(0, 'Price cannot be negative').required('Price is required'),
    start_Date: Yup.date().required('Start date is required'),
    end_Date: Yup.date().min(
      Yup.ref('start_Date'),
      'End date must be after start date'
    ).required('End date is required'),
    isOnline: Yup.boolean().required('Online status is required')
  });

  // Check if bootcamps are available from API response
  const hasBootcamps = bootcampFetchData && 
                       bootcampFetchData.isSuccess !== false && 
                       bootcampFetchData.result && 
                       bootcampFetchData.result.length > 0;

  // Handle bootcamp selection
  const handleBootcampSelect = (bootcamp) => {
    setSelectedBootcamp(bootcamp);
    // Reset local schedules and topics since we'll display from API
    setSchedules([]);
    setTopics([]);
    toast.info(`Selected bootcamp: ${bootcamp.title}`);
  };

  // Handle bootcamp selection from dropdown
  const handleBootcampDropdownChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const bootcamp = bootcampFetchData.result.find(bootcamp => bootcamp.id === selectedId);
      if (bootcamp) {
        setSelectedBootcamp(bootcamp);
        // Reset local schedules and topics since we'll display from API
        setSchedules([]);
        setTopics([]);
        toast.info(`Selected bootcamp: ${bootcamp.title}`);
      }
    } else {
      setSelectedBootcamp(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("trigger bootcamps data", bootcampFetchData);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle bootcamp submission
  const handleBootcampSubmit = async (values, { resetForm }) => {
    const bootcampId = uuidv4();
    const newBootcamp = { ...values, id: bootcampId };
    // setBootcampData(newBootcamp);
    await createNewBootcamp(newBootcamp).then((response) => {
        console.log("trigger createNewBootcamp",response)
        if (response.data.isSuccess) {
            toast.success(response.data.message)
        }
    })
    setSuccessMessage('Bootcamp information has been saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    console.log('Bootcamp data:', newBootcamp);
    resetForm();
  };

  // Handle schedule submission
  const handleScheduleSubmit = async (values, { resetForm }) => {
    if (!selectedBootcamp) {
      toast.error('Please select a bootcamp first');
      return;
    }
    
    const newSchedule = {
      startAndEndDate: values.startAndEndDate,
      date: values.date,
      topic: values.topic,
      bootCampId: selectedBootcamp.id || selectedBootcamp.bootcampId
    };
    
    try {
      const response = await createNewBootcampSchedule(newSchedule).unwrap();
      if (response.isSuccess) {
        toast.success('Schedule has been added successfully!');
        setSchedules([...schedules, { ...newSchedule, id: uuidv4() }]);
      } else {
        toast.error(response.message || 'Failed to add schedule');
      }
    } catch (error) {
      toast.error('Error adding schedule: ' + (error.message || 'Unknown error'));
    }
    resetForm();
  };

  // Handle topic submission with API interaction
  const handleTopicSubmit = async (values, { resetForm }) => {
    if (!selectedBootcamp) {
      toast.error('Please select a bootcamp first');
      return;
    }
    const newTopic = {
      title: values.title,
      bootcampId: selectedBootcamp.id || selectedBootcamp.bootcampId
    };
    try {
      const response = await createNewBootcampTopic(newTopic).unwrap();
      if (response.isSuccess) {
        toast.success('Topic has been added successfully!');
        setTopics([...topics, { ...newTopic, id: uuidv4() }]);
      } else {
        toast.success(response.message || 'Failed to add topic');
      }
    } catch (error) {
      toast.error('Error adding topic: ' + (error.message || 'Unknown error'));
    }
    resetForm();
  };

  // Handle schedule deletion
  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  // Handle topic deletion
  const handleDeleteTopic = (id) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  return (
    <>
    <Navbar></Navbar>
    <Container className="bootcamp-management-container my-5 py-4 rounded">
      <h2 className="text-center mb-4 text-gradient">Bootcamp Management</h2>
      {successMessage && (
        <Alert variant="success" className="text-center animate-alert">
          {successMessage}
        </Alert>
      )}

      {/* Bootcamp Selection Section */}
      {hasBootcamps && (
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">Select Bootcamp</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {bootcampFetchData.result.map((bootcamp, index) => (
                <Col md={4} key={index} className="mb-3">
                  <Card 
                    className={`h-100 ${selectedBootcamp && selectedBootcamp.id === bootcamp.id ? 'border-primary' : ''}`}
                    onClick={() => handleBootcampSelect(bootcamp)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Img 
                      variant="top" 
                      src={bootcamp.thumbnail_Url} 
                      alt={bootcamp.title}
                      style={{ height: '150px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{bootcamp.title}</Card.Title>
                      <Card.Text className="mb-1">{bootcamp.short_Description}</Card.Text>
                      <Card.Text className="mb-1">
                        <small className="text-muted">
                          {formatDate(bootcamp.start_Date)} - {formatDate(bootcamp.end_Date)}
                        </small>
                      </Card.Text>
                      <Badge bg={selectedBootcamp && selectedBootcamp.id === bootcamp.id ? "primary" : "secondary"}>
                        {selectedBootcamp && selectedBootcamp.id === bootcamp.id ? "Selected" : "Click to select"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      <Tabs
        id="bootcamp-management-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 custom-tabs"
      >
        <Tab eventKey="bootcamp" title="Bootcamp Information">
          <Card className="shadow-lg border-0 card-gradient">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Create Bootcamp</h5>
            </Card.Header>
            <Card.Body>
              <Formik
                initialValues={{
                  title: '',
                  slug: '',
                  short_Description: '',
                  description: '',
                  thumbnail_Url: '',
                  price: 0,
                  start_Date: new Date(),
                  end_Date: new Date(),
                  isOnline: true
                }}
                validationSchema={bootcampValidationSchema}
                onSubmit={handleBootcampSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.title && !!errors.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Slug</Form.Label>
                          <Form.Control
                            type="text"
                            name="slug"
                            value={values.slug}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.slug && !!errors.slug}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.slug}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Short Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="short_Description"
                        value={values.short_Description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.short_Description && !!errors.short_Description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.short_Description}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.description && !!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Thumbnail URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="thumbnail_Url"
                        value={values.thumbnail_Url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.thumbnail_Url && !!errors.thumbnail_Url}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.thumbnail_Url}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.price && !!errors.price}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Date</Form.Label>
                          <DatePicker
                            selected={values.start_Date}
                            onChange={(date) => setFieldValue('start_Date', date)}
                            className={`form-control ${touched.start_Date && errors.start_Date ? 'is-invalid' : ''}`}
                            dateFormat="yyyy-MM-dd"
                          />
                          {touched.start_Date && errors.start_Date && (
                            <div className="invalid-feedback d-block">
                              {errors.start_Date}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date</Form.Label>
                          <DatePicker
                            selected={values.end_Date}
                            onChange={(date) => setFieldValue('end_Date', date)}
                            className={`form-control ${touched.end_Date && errors.end_Date ? 'is-invalid' : ''}`}
                            dateFormat="yyyy-MM-dd"
                          />
                          {touched.end_Date && errors.end_Date && (
                            <div className="invalid-feedback d-block">
                              {errors.end_Date}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="isOnline"
                        name="isOnline"
                        label="Online Bootcamp"
                        checked={values.isOnline}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button variant="primary" type="submit">
                        Save Bootcamp
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="schedule" title="Bootcamp Schedule">
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card.Title>Add Schedule</Card.Title>
                  <Formik
                    initialValues={{
                      startAndEndDate: '',
                      date: new Date(),
                      topic: ''
                    }}
                    validationSchema={Yup.object({
                      startAndEndDate: Yup.string().required('Time range is required'),
                      date: Yup.date().required('Date is required'),
                      topic: Yup.string().required('Topic is required')
                    })}
                    onSubmit={handleScheduleSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date</Form.Label>
                          <DatePicker
                            selected={values.date}
                            onChange={(date) => setFieldValue('date', date)}
                            className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                            dateFormat="yyyy-MM-dd"
                          />
                          {touched.date && errors.date && (
                            <div className="invalid-feedback d-block">
                              {errors.date}
                            </div>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Time Range (e.g., 09:00-12:00)</Form.Label>
                          <Form.Control
                            type="text"
                            name="startAndEndDate"
                            value={values.startAndEndDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.startAndEndDate && !!errors.startAndEndDate}
                            placeholder="e.g., 09:00-12:00"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.startAndEndDate}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Topic</Form.Label>
                          <Form.Control
                            type="text"
                            name="topic"
                            value={values.topic}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.topic && !!errors.topic}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.topic}
                          </Form.Control.Feedback>
                        </Form.Group>
<Form.Group className="mb-4">
            <Form.Label><strong>Select Bootcamp</strong></Form.Label>
            <Form.Select 
              onChange={handleBootcampDropdownChange}
              value={selectedBootcamp ? selectedBootcamp.id : ''}
              className="mb-3"
            >
              <option value="">-- Select a bootcamp --</option>
              {bootcampFetchData && bootcampFetchData.result && bootcampFetchData.result.map((bootcamp) => (
                <option key={bootcamp.id} value={bootcamp.id}>
                  {bootcamp.title}
                </option>
              ))}
            </Form.Select>
            {selectedBootcamp && (
              <div className="selected-bootcamp-info p-2 bg-light rounded mb-3">
                <small>
                  <strong>Selected:</strong> {selectedBootcamp.title}<br/>
                  <strong>Period:</strong> {new Date(selectedBootcamp.start_Date).toLocaleDateString()} - {new Date(selectedBootcamp.end_Date).toLocaleDateString()}
                </small>
              </div>
            )}
          </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={!selectedBootcamp}
                        >
                          Add Schedule
                        </Button>
                        {!selectedBootcamp && (
                          <p className="text-danger mt-2">
                            Please select a bootcamp first
                          </p>
                        )}
                      </Form>
                    )}
                  </Formik>
                </Col>

                <Col md={6}>
                  <Card.Title>Schedule List</Card.Title>
                  {schedules.length > 0 ? (
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Topic</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td>{schedule.date.toLocaleDateString()}</td>
                            <td>{schedule.startAndEndDate}</td>
                            <td>{schedule.topic}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteSchedule(schedule.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="light">No schedules added yet.</Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="topics" title="Bootcamp Topics">
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card.Title>Add Topic</Card.Title>
                  {/* Bootcamp Dropdown */}
                  {hasBootcamps && (
                    <Form.Group className="mb-4">
                      <Form.Label><strong>Select Bootcamp</strong></Form.Label>
                      <Form.Select 
                        onChange={handleBootcampDropdownChange}
                        value={selectedBootcamp ? selectedBootcamp.id : ''}
                        className="mb-3"
                      >
                        <option value="">-- Select a bootcamp --</option>
                        {bootcampFetchData.result.map((bootcamp) => (
                          <option key={bootcamp.id} value={bootcamp.id}>
                            {bootcamp.title} ({new Date(bootcamp.start_Date).toLocaleDateString()} - {new Date(bootcamp.end_Date).toLocaleDateString()})
                          </option>
                        ))}
                      </Form.Select>
                      {selectedBootcamp && (
                        <div className="selected-bootcamp-info p-2 bg-light rounded mb-3">
                          <small>
                            <strong>Selected:</strong> {selectedBootcamp.title}<br/>
                            <strong>Description:</strong> {selectedBootcamp.short_Description}
                          </small>
                        </div>
                      )}
                    </Form.Group>
                  )}
                  <Formik
                    initialValues={{
                      title: ''
                    }}
                    validationSchema={Yup.object({
                      title: Yup.string().required('Topic title is required')
                    })}
                    onSubmit={handleTopicSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Topic Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.title && !!errors.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={!selectedBootcamp}
                        >
                          Add Topic
                        </Button>
                        {!selectedBootcamp && (
                          <p className="text-danger mt-2">
                            Please select a bootcamp first
                          </p>
                        )}
                      </Form>
                    )}
                  </Formik>
                </Col>
                
                <Col md={6}>
                  <Card.Title>Topics List</Card.Title>
                  {topics.length > 0 ? (
                    <div className="topic-list">
                      {topics.map((topic) => (
                        <Card key={topic.id} className="mb-2">
                          <Card.Body className="d-flex justify-content-between align-items-center py-2">
                            <div>
                              <Badge bg="info" className="me-2">Topic</Badge>
                              {topic.title}
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteTopic(topic.id)}
                            >
                              Delete
                            </Button>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="light">No topics added yet.</Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Enhanced selected bootcamp details section */}
      {selectedBootcamp && (
        <div className="selected-bootcamp-details mt-4">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Selected Bootcamp Details</h5>
              <Badge bg={selectedBootcamp.isOnline ? "info" : "warning"}>
                {selectedBootcamp.isOnline ? "Online" : "In-person"}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <img 
                    src={selectedBootcamp.thumbnail_Url} 
                    alt={selectedBootcamp.title}
                    className="img-fluid rounded shadow bootcamp-image"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </Col>
                <Col md={8}>
                  <h3 className="bootcamp-title">{selectedBootcamp.title}</h3>
                  <p className="text-muted mb-2">{selectedBootcamp.slug}</p>
                  <hr />
                  <Row>
                    <Col md={6}>
                      <p><strong>Start Date:</strong> {formatDate(selectedBootcamp.start_Date)}</p>
                      <p><strong>End Date:</strong> {formatDate(selectedBootcamp.end_Date)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Price:</strong> <span className="text-primary">${selectedBootcamp.price}</span></p>
                      <p><strong>Format:</strong> {selectedBootcamp.isOnline ? 'Online' : 'In-person'}</p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <h5>Description</h5>
                    <p className="bootcamp-description">{selectedBootcamp.description}</p>
                    <p className="bootcamp-short-description"><em>{selectedBootcamp.short_Description}</em></p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="mb-4">
            {/* Bootcamp Topics Section */}
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Bootcamp Topics</h5>
                </Card.Header>
                <Card.Body className="bootcamp-topics-section">
                  {selectedBootcamp.bootcampTopics && selectedBootcamp.bootcampTopics.length > 0 ? (
                    <div className="topic-list">
                      {selectedBootcamp.bootcampTopics.map((topic, index) => (
                        <div key={topic.id || index} className="topic-item p-3 mb-2 rounded">
                          <div className="d-flex align-items-center">
                            <span className="topic-number me-3">{index + 1}</span>
                            <div>
                              <h6 className="mb-0">{topic.title}</h6>
                              <small className="text-muted">Added: {formatDate(topic.createdDate)}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No topics have been added to this bootcamp yet.</p>
                      <small>Add topics using the "Bootcamp Topics" tab above.</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Bootcamp Schedule Section */}
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Bootcamp Schedule</h5>
                </Card.Header>
                <Card.Body className="bootcamp-schedule-section">
                  {selectedBootcamp.bootcampSchedule && selectedBootcamp.bootcampSchedule.length > 0 ? (
                    <div className="table-responsive">
                      <Table striped hover className="schedule-table mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Topic</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBootcamp.bootcampSchedule.map((schedule, index) => (
                            <tr key={schedule.id || index}>
                              <td>{index + 1}</td>
                              <td>{formatDate(schedule.date)}</td>
                              <td>{schedule.startAndEndDate}</td>
                              <td>{schedule.topic}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No schedule items have been added to this bootcamp yet.</p>
                      <small>Add schedule items using the "Bootcamp Schedule" tab above.</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Bootcamp Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <div className="stat-card p-3 bg-light rounded">
                    <h2 className="text-primary mb-0">{selectedBootcamp.bootcampTopics?.length || 0}</h2>
                    <p className="text-muted mb-0">Topics</p>
                  </div>
                </Col>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <div className="stat-card p-3 bg-light rounded">
                    <h2 className="text-success mb-0">{selectedBootcamp.bootcampSchedule?.length || 0}</h2>
                    <p className="text-muted mb-0">Schedule Items</p>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="stat-card p-3 bg-light rounded">
                    <h2 className="text-info mb-0">
                      {
                        Math.ceil(
                          (new Date(selectedBootcamp.end_Date) - new Date(selectedBootcamp.start_Date)) / 
                          (1000 * 60 * 60 * 24)
                        ) || 0
                      }
                    </h2>
                    <p className="text-muted mb-0">Days Duration</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      {!selectedBootcamp && !hasBootcamps && (
        <Alert variant="info" className="text-center">
          <p className="mb-2">You haven't created any bootcamps yet.</p>
          <p className="mb-0">Use the "Bootcamp Information" tab to create your first bootcamp.</p>
        </Alert>
      )}

      {!selectedBootcamp && hasBootcamps && (
        <Alert variant="info" className="text-center">
          <p className="mb-0">Please select a bootcamp from above to view and manage its details.</p>
        </Alert>
      )}
    </Container>
    <Footer></Footer>
    </>
  );
};

export default  InstructorAuth(InstructorBootcampManagement);
