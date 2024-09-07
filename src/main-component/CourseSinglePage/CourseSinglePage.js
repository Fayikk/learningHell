import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import CoureseTab from "./Tabs/CoureseTab";
import Sidebar from "./sidebar";
import { useGetCourseDetailByIdQuery } from "../../api/courseApi";
import IsLoading from "../../components/Loading/IsLoading";
import { useThisCourseEnrolledUserMutation } from "../../api/studentCourseApi";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import CourseSingleAccardion from "./CourseSingleAccardion";
import InstructorDetails from "./InstructorDetails";
import Review from "./Tabs/Review";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const CourseSinglePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, isLoading } = useGetCourseDetailByIdQuery(slug);
  const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
  const [ownMyCourse, setOwnMyCourse] = useState(false);
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [course, setCourse] = useState();
  const [cart, setCart] = useState(false);
  const authenticationState = useSelector(
    (state) => state.authStore.nameIdentifier
  );
  const courseData = data?.result?.item1;


  console.log("trigger course data",courseData)
  useEffect(() => {
    if (data) {
      setCourse(data.result.item1);
      console.log("trigger data bang", data);
    }

    async function CheckActiveCourse() {
      const decode = jwtDecode(localStorage.getItem("token"));

      const model = {
        userId: decode.nameid,
        courseId: data?.result?.item1?.courseId,
      };

      console.log("trigger model", model);

      await CheckHasThisCourse(model).then((response) =>{
        setIsEnrolledCourse(response.data)
      
      }
      );
    }
    CheckActiveCourse();
  }, [isLoading]);

  if (isLoading || !course) {
    return <IsLoading />;
  }



  const triggerButton = () => {

    navigate(`/lessons/${course.courseId}`)
  }

  return (
    <Fragment>
      <Navbar />
      <div className="container mx-auto flex flex-col sm:gap-5 gap-3 sm:px-28 mb-10">
        <Breadcrumbs
          steps={[
            {
              title: courseData?.courseName,
              to: `/course-single/${slug}`,
            },
            
          ]}
        />
        <div className="flex justify-between bg-gray-200 p-5 rounded-2xl sm:flex-row flex-col gap-4">
          <img
            src={courseData?.courseImage}
            alt=""
            className="rounded-md shadow-md sm:max-w-[550px] h-auto flex order-1"
          />
          <div className="flex flex-col justify-center gap-2 px-1">
            <h1 className="text-2xl font-bold">{courseData?.courseName}</h1>
            <p className="text-black">{courseData?.courseDescription}</p>

            {isEnrolledCourse ? (
              <div className="flex justify-end">
                <button className="theme-btn-s2" onClick={triggerButton} >Derse Başla</button>
              </div>
            ) : (
              <Sidebar courseDetail={courseData} ></Sidebar>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 items-start">
          <div className="flex sm:flex-col flex-1 flex-col justify-between sm:gap-8 gap-4">
            <CourseSingleAccardion courseDetail={course} />
            <Review />
          </div>
          <InstructorDetails instructor={data?.result?.item1?.user} />
        </div>
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default CourseSinglePage;
