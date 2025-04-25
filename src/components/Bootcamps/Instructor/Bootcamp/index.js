import React, { useState, useRef, useEffect } from 'react';
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
  Badge,
  Image,
  Modal
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import Navbar from '../../../Navbar/Navbar';
import Footer from '../../../footer/Footer';
import { useCreateNewBootcampMutation, useGetAllBootcampByUserQuery, useUpdateBootcampMutation } from '../../../../api/bootcampApi';
import { useCreateNewBootcampTopicMutation } from '../../../../api/bootcampTopicApi';
import { useCreateNewBootcampScheduleMutation } from '../../../../api/bootcampScheduleApi';
import {toast} from 'react-toastify';
import InstructorAuth from '../../../../Wrappers/HoC/InstructorAuth';
import { useAddBootcampInstructorDetailMutation } from '../../../../api/bootcampInstructorDetailApi';

const InstructorBootcampManagement = () => {
  const [key, setKey] = useState('bootcamp');
  const [bootcampData, setBootcampData] = useState(null);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const {data:bootcampFetchData,error,isLoading} = useGetAllBootcampByUserQuery();
  const [createNewBootcamp] = useCreateNewBootcampMutation();
  const [createNewBootcampTopic] = useCreateNewBootcampTopicMutation();
  const [createNewBootcampSchedule] = useCreateNewBootcampScheduleMutation();
  const [addBootcampInstructorDetail] = useAddBootcampInstructorDetailMutation();
  const [updateBootcamp] = useUpdateBootcampMutation();
  
  // Yeni state'ler
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormInitialValues, setUpdateFormInitialValues] = useState({
    bootcampId: '',
    title: '',
    slug: '',
    short_Description: '',
    description: '',
    thumbnail_Url: '',
    price: 0,
    start_Date: new Date(),
    end_Date: new Date(),
    isOnline: true,
    isActive: true,
    userId: ''
  });

  // Kullanıcı ID'sini alma
  const getUserId = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.id || '';
      }
    } catch (error) {
      console.error("Failed to get user ID from localStorage:", error);
    }
    return '';
  };

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

  // New validation schema for instructor details
  const instructorDetailValidationSchema = Yup.object().shape({
    full_Name: Yup.string().required('Full name is required'),
    short_Description: Yup.string(),
    description: Yup.string(),
    education: Yup.string().required('Education is required'),
    experience: Yup.string().required('Experience is required'),
    skills: Yup.string(),
    image_Url: Yup.string().url('Must be a valid URL'),
    linkedin_Url: Yup.string().url('Must be a valid URL'),
    twitter_Url: Yup.string().url('Must be a valid URL'),
    instagram_Url: Yup.string().url('Must be a valid URL'),
    facebook_Url: Yup.string().url('Must be a valid URL'),
    youtube_Url: Yup.string().url('Must be a valid URL'),
    udemy_Url: Yup.string().url('Must be a valid URL')
  });

  // Güncelleme modalını açma
  const handleOpenUpdateModal = () => {
    if (!selectedBootcamp) {
      toast.error('Lütfen güncellenecek bootcamp seçin');
      return;
    }


    console.log("trigger selectedBootcamp", selectedBootcamp);  
    // Form için başlangıç değerlerini ayarla
    setUpdateFormInitialValues({
      bootcampId: selectedBootcamp.id,
      title: selectedBootcamp.title || '',
      slug: selectedBootcamp.slug || '',
      short_Description: selectedBootcamp.short_Description || '',
      description: selectedBootcamp.description || '',
      thumbnail_Url: selectedBootcamp.thumbnail_Url || '',
      price: selectedBootcamp.price || 0,
      start_Date: selectedBootcamp.start_Date ? new Date(selectedBootcamp.start_Date) : new Date(),
      end_Date: selectedBootcamp.end_Date ? new Date(selectedBootcamp.end_Date) : new Date(),
      isOnline: selectedBootcamp.isOnline !== undefined ? selectedBootcamp.isOnline : true,
      isActive: selectedBootcamp.isActive !== undefined ? selectedBootcamp.isActive : true,
      userId: getUserId()
    });

    setShowUpdateModal(true);
  };

  // Bootcamp güncelleme validasyonu
  const updateBootcampValidationSchema = Yup.object().shape({
    title: Yup.string().required('Başlık gereklidir'),
    slug: Yup.string().required('Slug gereklidir'),
    short_Description: Yup.string().required('Kısa açıklama gereklidir'),
    description: Yup.string().required('Açıklama gereklidir'),
    thumbnail_Url: Yup.string().url('Geçerli bir URL girmelisiniz').required('Resim URL gereklidir'),
    price: Yup.number().min(0, 'Fiyat negatif olamaz').required('Fiyat gereklidir'),
    start_Date: Yup.date().required('Başlangıç tarihi gereklidir'),
    end_Date: Yup.date()
      .min(Yup.ref('start_Date'), 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
      .required('Bitiş tarihi gereklidir'),
    isOnline: Yup.boolean().required('Online durumu gereklidir'),
    isActive: Yup.boolean().required('Aktiflik Durumu gereklidir'),
  });

  // Bootcamp güncelleme fonksiyonu
  const handleUpdateBootcamp = async (values, { setSubmitting }) => {
    try {
      const response = await updateBootcamp({
        bootcampId: values.bootcampId,
        title: values.title,
        slug: values.slug,
        short_Description: values.short_Description,
        description: values.description,
        thumbnail_Url: values.thumbnail_Url,
        price: Number(values.price),
        start_Date: values.start_Date,
        end_Date: values.end_Date,
        isOnline: values.isOnline,
        isActive: values.isActive,
        userId: values.userId
      }).unwrap();

      console.log("trigger updateBootcamp", response);


      if (response.isSuccess) {
        toast.success('Bootcamp başarıyla güncellendi');
        setShowUpdateModal(false);
        
        // Güncellenmiş bootcamp'i diğer bootcamp'ler arasında güncelle
        if (bootcampFetchData && bootcampFetchData.result) {
          const updatedBootcamps = bootcampFetchData.result.map(bootcamp => 
            bootcamp.id === values.bootcampId ? { ...bootcamp, ...values } : bootcamp
          );
          
          // Seçili bootcamp'i güncelle
          setSelectedBootcamp({ ...selectedBootcamp, ...values });
        }
      } else {
        toast.error(response.message || 'Güncelleme başarısız oldu');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu: ' + (error.data?.message || 'Bilinmeyen hata'));
    } finally {
      setSubmitting(false);
    }
  };

  // Check if bootcamps are available from API response
  const hasBootcamps = bootcampFetchData && 
                       bootcampFetchData.isSuccess !== false && 
                       bootcampFetchData.result && 
                       bootcampFetchData.result.length > 0;

  // Handle bootcamp selection
  const handleBootcampSelect = (bootcamp) => {
    console.log("trigger bootcamp handleBootcampSelect", bootcamp);  
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
        console.log("trigger bootcamp handleBootcampDropdownChange", bootcamp);
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

  // Handle file change for instructor image
  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue('file', file);
      
      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle instructor detail submission
  const handleInstructorDetailSubmit = async (values, { resetForm }) => {
    console.log("trigger values"  , values)

    if (!selectedBootcamp) {
      toast.error('Please select a bootcamp first');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('full_Name', values.full_Name);
      formData.append('short_Description', values.short_Description || '');
      formData.append('description', values.description || '');
      formData.append('education', values.education);
      formData.append('experience', values.experience);
      formData.append('skills', values.skills || '');
      formData.append('image_Url', values.image_Url || '');
      formData.append('linkedin_Url', values.linkedin_Url || '');
      formData.append('twitter_Url', values.twitter_Url || '');
      formData.append('instagram_Url', values.instagram_Url || '');
      formData.append('facebook_Url', values.facebook_Url || '');
      formData.append('youtube_Url', values.youtube_Url || '');
      formData.append('udemy_Url', values.udemy_Url || '');
      formData.append('bootcampId', selectedBootcamp.id || selectedBootcamp.bootcampId);
      
      // Append file if exists
      if (values.file) {
        formData.append('file', values.file);
      }

      // Send data to API
      const response = await addBootcampInstructorDetail(formData).unwrap();
      if (response.isSuccess) {
        toast.success('Instructor details added successfully!');
        resetForm();
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(response.message || 'Failed to add instructor details');
      }
    } catch (error) {
      toast.error('Error adding instructor details: ' + (error.message || 'Unknown error'));
    }
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

        {/* New Tab for Instructor Details */}
        <Tab eventKey="instructor" title="Instructor Details">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Add Instructor Details</h5>
            </Card.Header>
            <Card.Body>
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
                        {bootcamp.title}
                      </option>
                    ))}
                  </Form.Select>
                  {selectedBootcamp && (
                    <div className="selected-bootcamp-info p-2 bg-light rounded mb-3">
                      <small>
                        <strong>Selected:</strong> {selectedBootcamp.title}<br/>
                        <strong>Period:</strong> {formatDate(selectedBootcamp.start_Date)} - {formatDate(selectedBootcamp.end_Date)}
                      </small>
                    </div>
                  )}
                </Form.Group>
              )}

              <Formik
                initialValues={{
                  full_Name: '',
                  short_Description: '',
                  description: '',
                  education: '',
                  experience: '',
                  skills: '',
                  image_Url: '',
                  file: null,
                  linkedin_Url: '',
                  twitter_Url: '',
                  instagram_Url: '',
                  facebook_Url: '',
                  youtube_Url: '',
                  udemy_Url: ''
                }}
                validationSchema={instructorDetailValidationSchema}
                onSubmit={handleInstructorDetailSubmit}
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
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="full_Name"
                            value={values.full_Name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.full_Name && !!errors.full_Name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.full_Name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
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
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
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

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Education *</Form.Label>
                          <Form.Control
                            type="text"
                            name="education"
                            value={values.education}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.education && !!errors.education}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.education}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Experience *</Form.Label>
                          <Form.Control
                            type="text"
                            name="experience"
                            value={values.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.experience && !!errors.experience}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.experience}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Skills (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="skills"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.skills && !!errors.skills}
                        placeholder="React, Node.js, JavaScript, etc."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.skills}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Image URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="image_Url"
                            value={values.image_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.image_Url && !!errors.image_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.image_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Profile Image</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={(event) => handleFileChange(event, setFieldValue)}
                            ref={fileInputRef}
                            accept="image/*"
                          />
                          <Form.Text className="text-muted">
                            Upload an image file (PNG, JPG, JPEG)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    {imagePreview && (
                      <div className="text-center mb-3">
                        <p>Image Preview:</p>
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          thumbnail 
                          style={{ maxHeight: "200px" }} 
                        />
                      </div>
                    )}

                    <h5 className="mt-4 mb-3">Social Media Links</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>LinkedIn URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="linkedin_Url"
                            value={values.linkedin_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.linkedin_Url && !!errors.linkedin_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.linkedin_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Twitter URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="twitter_Url"
                            value={values.twitter_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.twitter_Url && !!errors.twitter_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.twitter_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Instagram URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="instagram_Url"
                            value={values.instagram_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.instagram_Url && !!errors.instagram_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.instagram_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Facebook URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="facebook_Url"
                            value={values.facebook_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.facebook_Url && !!errors.facebook_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.facebook_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>YouTube URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="youtube_Url"
                            value={values.youtube_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.youtube_Url && !!errors.youtube_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.youtube_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Udemy URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="udemy_Url"
                            value={values.udemy_Url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.udemy_Url && !!errors.udemy_Url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.udemy_Url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!selectedBootcamp}
                        className="px-5"
                      >
                        Save Instructor Details
                      </Button>
                      {!selectedBootcamp && (
                        <p className="text-danger mt-2">
                          Please select a bootcamp first
                        </p>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
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
              <div>
                <Button 
                  variant="light" 
                  size="sm" 
                  onClick={handleOpenUpdateModal}
                  className="me-2"
                >
                  <i className="fa fa-edit"></i> Güncelle
                </Button>
                <Badge bg={selectedBootcamp.isOnline ? "info" : "warning"}>
                  {selectedBootcamp.isOnline ? "Online" : "In-person"}
                </Badge>
              </div>
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
      {/* Güncelleme Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bootcamp Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={updateFormInitialValues}
            validationSchema={updateBootcampValidationSchema}
            onSubmit={handleUpdateBootcamp}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlık</Form.Label>
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
                  <Form.Label>Kısa Açıklama</Form.Label>
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
                  <Form.Label>Açıklama</Form.Label>
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
                  <Form.Label>Resim URL</Form.Label>
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
                  {values.thumbnail_Url && (
                    <div className="mt-2">
                      <img 
                        src={values.thumbnail_Url} 
                        alt="Thumbnail Preview" 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                        className="img-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fiyat</Form.Label>
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
                      <Form.Label>Başlangıç Tarihi</Form.Label>
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
                      <Form.Label>Bitiş Tarihi</Form.Label>
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
                    id="updateIsOnline"
                    name="isOnline"
                    label="Online Bootcamp"
                    checked={values.isOnline}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="updateIsActive"
                    name="isActive"
                    label="Is Active"
                    checked={values.isActive}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="text-end mt-4">
                  <Button variant="secondary" onClick={() => setShowUpdateModal(false)} className="me-2">
                    İptal
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Güncelleniyor...' : 'Kaydet'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
    <Footer></Footer>
    </>
  );
};

export default  InstructorAuth(InstructorBootcampManagement);
