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

const InstructorBootcampManagement = () => {
  const [key, setKey] = useState('bootcamp');
  const [bootcampData, setBootcampData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Handle bootcamp submission
  const handleBootcampSubmit = (values, { resetForm }) => {
    const bootcampId = uuidv4();
    const newBootcamp = { ...values, id: bootcampId };
    setBootcampData(newBootcamp);
    setSuccessMessage('Bootcamp information has been saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    // In a real application, you would make an API call here to save the data
    console.log('Bootcamp data:', newBootcamp);
    resetForm();
  };

  // Handle schedule submission
  const handleScheduleSubmit = (values, { resetForm }) => {
    if (!bootcampData) {
      alert('Please create a bootcamp first');
      return;
    }
    
    const newSchedule = {
      ...values,
      id: uuidv4(),
      bootCampId: bootcampData.id
    };
    
    setSchedules([...schedules, newSchedule]);
    setSuccessMessage('Schedule has been added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    // In a real application, you would make an API call here
    console.log('Schedule data:', newSchedule);
    resetForm();
  };

  // Handle topic submission
  const handleTopicSubmit = (values, { resetForm }) => {
    if (!bootcampData) {
      alert('Please create a bootcamp first');
      return;
    }
    
    const newTopic = {
      ...values,
      id: uuidv4(),
      bootcampId: bootcampData.id
    };
    
    setTopics([...topics, newTopic]);
    setSuccessMessage('Topic has been added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    // In a real application, you would make an API call here
    console.log('Topic data:', newTopic);
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

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={!bootcampData}
                        >
                          Add Schedule
                        </Button>
                        {!bootcampData && (
                          <p className="text-danger mt-2">
                            Please create a bootcamp first
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
                          disabled={!bootcampData}
                        >
                          Add Topic
                        </Button>
                        {!bootcampData && (
                          <p className="text-danger mt-2">
                            Please create a bootcamp first
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

      {bootcampData && (
        <Card className="mt-4 shadow-sm">
          <Card.Body>
            <Card.Title>Current Bootcamp</Card.Title>
            <Row>
              <Col md={8}>
                <p><strong>Title:</strong> {bootcampData.title}</p>
                <p><strong>Short Description:</strong> {bootcampData.short_Description}</p>
                <p><strong>Duration:</strong> {bootcampData.start_Date.toLocaleDateString()} to {bootcampData.end_Date.toLocaleDateString()}</p>
                <p><strong>Type:</strong> {bootcampData.isOnline ? 'Online' : 'In-person'}</p>
                <p><strong>Price:</strong> ${bootcampData.price}</p>
              </Col>
              <Col md={4} className="text-center">
                {bootcampData.thumbnail_Url && (
                  <img 
                    src={bootcampData.thumbnail_Url} 
                    alt={bootcampData.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '150px' }}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
    <Footer></Footer>
    </>
  );
};

export default InstructorBootcampManagement;
