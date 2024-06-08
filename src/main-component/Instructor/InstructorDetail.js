import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/pagetitle/PageTitle';
import CourseSection from '../../components/CourseSection/CourseSection';
import { useGetAllInstructorCoursesMutation } from '../../api/instructorApi';
import IsLoading from '../../components/Loading/IsLoading';
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import InstructorAuth from '../../Wrappers/HoC/InstructorAuth';
function InstructorDetail() {
  const [courses, setCourses] = useState();
  const [getAllInstructorCourses] = useGetAllInstructorCoursesMutation();

  useEffect(() => {

    async function fetchAllMyCourses(){
      await getAllInstructorCourses().then((response) => {
        console.log(response)
        setCourses(response.data.result)
      })
    }

    fetchAllMyCourses()
  }, []);



  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle={'Instructor'} pagesub={'Instructor'} />
      <div style={{ textAlign: 'right' }}>
    <button className="btn btn-success">New Course Create</button>
</div>
      <CourseSectionS3 courses={courses} component={"instructor"} />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export default InstructorAuth(InstructorDetail);
