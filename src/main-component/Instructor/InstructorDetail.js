import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/pagetitle/PageTitle';
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import InstructorAuth from '../../Wrappers/HoC/InstructorAuth';
import { useGetAllInstructorCoursesMutation } from '../../api/instructorApi';
import { useCreateCourseAsyncMutation } from '../../api/courseApi';
import IsLoading from '../../components/Loading/IsLoading';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from 'reactstrap';
import { instructorApi } from '../../api/instructorApi';
import { useDispatch } from 'react-redux';
import {toast} from 'react-toastify' 
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
  const [getAllInstructorCourses] = useGetAllInstructorCoursesMutation();
  const [createCourseAsync] = useCreateCourseAsyncMutation();
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
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    async function fetchAllMyCourses() {
      const response = await getAllInstructorCourses();
      if (response.data) {
        setCourses(response.data.result);
      }
    }
    fetchAllMyCourses();
  }, []);

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
      console.log(response)
      if (response.data.isSuccess) {
        handleClose();
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        toast.success(response.data.messages[0])
      }
    })
  };

  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle={'Instructor'} pagesub={'Instructor'} />
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleOpen}>Create New Course</Button>
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
                  <Input
                    type='file'
                    placeholder='Introduction Video'
                    onChange={(e) => setIntroductionVideo(e.target.files[0])}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='file'
                    placeholder='Image'
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Image Url'
                    onChange={(e) => setCourseModel({ ...courseModel, imageUrl: e.target.value })}
                  />
                </div>
                <div className='row'>
                  <Input
                    type='text'
                    placeholder='Category'
                    onChange={(e) => setCourseModel({ ...courseModel, categoryId: e.target.value })}
                  />
                </div>
              </div>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button onClick={createCourse}>Save Course</Button>
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
