import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/pagetitle/PageTitle';
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import InstructorAuth from '../../Wrappers/HoC/InstructorAuth';
import { useGetAllInstructorCoursesQuery } from '../../api/instructorApi';
import { useCreateCourseAsyncMutation, useRemoveCourseAsyncMutation } from '../../api/courseApi';
import IsLoading from '../../components/Loading/IsLoading';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from 'reactstrap';
import { instructorApi } from '../../api/instructorApi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLazyGetAllCategoriesForSelectedQuery } from '../../api/categoryApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function InstructorDetail() {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const { data, isLoading: isCoursesLoading } = useGetAllInstructorCoursesQuery();
  const [getAllCategories, { data: categoriesData, isLoading: isCategoriesLoading }] = useLazyGetAllCategoriesForSelectedQuery();
  const [createCourseAsync] = useCreateCourseAsyncMutation();
  const [removeCourseAsync] = useRemoveCourseAsyncMutation();

  const [courseModel, setCourseModel] = useState({
    courseName: "",
    coursePrice: 0,
    courseLanguage: "",
    courseDescription: "",
    imageUrl: "",
    categoryId: ""
  });
  const [introductionVideo, setIntroductionVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCourseModal, setOpenCourseModal] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleOpenCourseModal = () => setOpenCourseModal(true);
  const handleCloseCourseModal = () => setOpenCourseModal(false);

  useEffect(() => {
    if (data) {
      setCourses(data.result);
    }
  }, [data]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.result);
    }
  }, [categoriesData]);

  if (isCoursesLoading || isCategoriesLoading) {
    return <IsLoading />;
  }

  const createCourse = async () => {
    const formData = new FormData();
    formData.append("CourseName", courseModel.courseName);
    formData.append("CoursePrice", courseModel.coursePrice);
    formData.append("CourseLanguage", courseModel.courseLanguage);
    formData.append("CourseDescription", courseModel.courseDescription);
    formData.append("IntroductionVideo", introductionVideo);
    formData.append("Image", image);
    formData.append("ImageUrl", courseModel.imageUrl);
    formData.append("CategoryId", courseModel.categoryId);

    await createCourseAsync(formData).then((response) => {
      if (response.data.isSuccess) {
        handleClose();
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        toast.success(response.data.messages[0]);
      } else {
        toast.error("Course creation failed");
      }
    });
  };

  const handleRemoveCourse = async (courseId) => {
    const answer = window.confirm("Are you sure you want to delete this course?");
    if (answer) {
      await removeCourseAsync(courseId).then((response) => {
        if (response.data.isSuccess) {
          toast.success("Course removed successfully");
          setOpenCourseModal(false);
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
        }
      });
    }
  };

  const selectedCategory = async () => {
    await getAllCategories();
  };

  console.log("trigger courses",courses)

  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle={'Instructor'} pagesub={'Instructor'} />
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleOpen}>Create New Course</Button>
        <Button onClick={handleOpenCourseModal} style={{ color: "red" }}>Remove Course</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <div className='col'>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Course Name'
                    onChange={(e) => setCourseModel({ ...courseModel, courseName: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='number'
                    placeholder='Course Price'
                    onChange={(e) => setCourseModel({ ...courseModel, coursePrice: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Course Language'
                    onChange={(e) => setCourseModel({ ...courseModel, courseLanguage: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Course Description'
                    onChange={(e) => setCourseModel({ ...courseModel, courseDescription: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <span>Introduction Video</span>
                  <Input
                    type='file'
                    placeholder='Introduction Video'
                    onChange={(e) => setIntroductionVideo(e.target.files[0])}
                  />
                </div>
                <div className='row'>
                  <span>Course Image</span>
                  <Input
                    type='file'
                    placeholder='Image'
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Image Url(Optional)'
                    onChange={(e) => setCourseModel({ ...courseModel, imageUrl: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <select
                    onClick={selectedCategory}
                    onChange={(e) => setCourseModel({ ...courseModel, categoryId: e.target.value })}
                    placeholder='Choose category'
                    title='categories'
                  >
                    <option value="" disabled selected>Choose category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button onClick={createCourse}>Save Course</Button>
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={openCourseModal}
          onClose={handleCloseCourseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <Container>
                <Row>
                  {courses.map((course, key) => (
                    <Col style={{ marginTop: "6px" }} key={course.courseId}>
                      {course.courseName} - 
                      <button className='btn btn-danger' onClick={() => handleRemoveCourse(course.courseId)}>
                        Remove This Course
                      </button>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Typography>
          </Box>
        </Modal>
      </div>
      <CourseSectionS3 courses={courses} component={"instructor"} />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export default InstructorAuth(InstructorDetail);
