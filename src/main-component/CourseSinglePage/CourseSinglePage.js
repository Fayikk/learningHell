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
import { useGiftCourseMutation, useThisCourseEnrolledUserMutation } from "../../api/studentCourseApi";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import CourseSingleAccardion from "./CourseSingleAccardion";
import InstructorDetails from "./InstructorDetails";
import Review from "./Tabs/Review";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";
const CourseSinglePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, isLoading } = useGetCourseDetailByIdQuery(slug);
  const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
  const [giftCourse] = useGiftCourseMutation();
  const [ownMyCourse, setOwnMyCourse] = useState(false);
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [course, setCourse] = useState();
  const [cart, setCart] = useState(false);
  const authenticationState = useSelector(
    (state) => state.authStore
  );
  const courseData = data?.result?.item1;
  console.log("trigger authentication state",authenticationState)
  useEffect(() => {
    if (data) {
      setCourse(data.result.item1);
    }

    async function CheckActiveCourse() {
      const decode = jwtDecode(localStorage.getItem("token"));

      const model = {
        userId: decode.nameid,
        courseId: data?.result?.item1?.courseId,
      };

      await CheckHasThisCourse(model).then((response) => {
        setIsEnrolledCourse(response.data);
      });
    }
    CheckActiveCourse();
  }, [isLoading]);

  if (isLoading || !course) {
    return <IsLoading />;
  }

  const triggerButton = () => {
    console.log("trigge",course.courseId)
    navigate(`/lessons/${course.courseId}`);
  };
  const giftCourseThisUser = async () => {
    console.log("trigger");
    const courseModel = {
      email: authenticationState.email,
      courseId: slug
    };
  
    var result = await giftCourse(courseModel).then((response) => {
      if (response.error && response.error.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });

        toast.warning("Please login first");
        return;
      }
  
      if (response.data.isSuccess) {
        toast.success(response.data.message);
  
        setTimeout(() => {
          navigate(0); 
        }, 1000);
      } else {
        toast.warning(response.data.message);
      }
    });
  };
  


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
      <video
  src={courseData?.introductionVideoUrl}
  className="rounded-md shadow-md sm:max-w-[550px] h-auto flex order-1 no-outline"
  controls
  style={{ width: '550px', height: '310px' }} // Sabit boyut
  onClick={(e) => e.target.play()}
/>

        <div className="w-full gap-2 flex flex-col justify-center gap-2 px-1">
          <h1 className="text-2xl font-bold">{courseData?.courseName}</h1>
          <p className="text-black">{courseData?.courseDescription}</p>
  
          {isEnrolledCourse ? (
            <div className="flex justify-end">
              <button className="theme-btn-s2" onClick={triggerButton}>
                Derse Başla
              </button>
            </div>
          ) : courseData?.coursePrice === 0 ? (
            <div className="flex justify-end">
              <button className="theme-btn-s2" onClick={giftCourseThisUser}>
                Derse Kayıt Ol
              </button>
            </div>
          ) : (
            <Sidebar courseDetail={courseData}></Sidebar>
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
