import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { useParams } from "react-router-dom";
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

const CourseSinglePage = (props) => {
  const { slug } = useParams();
  const { data, isLoading } = useGetCourseDetailByIdQuery(slug);
  const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
  const [ownMyCourse, setOwnMyCourse] = useState(false);
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [course, setCourse] = useState();
  const [open, setOpen] = React.useState([]);
  const authenticationState = useSelector(
    (state) => state.authStore.nameIdentifier
  );

  useEffect(() => {
    if (data) {
      setCourse(data.result.item1);
      console.log("trigger data bang",data)
    }

    async function CheckActiveCourse() {
      const decode = jwtDecode(localStorage.getItem("token"));

      const model = {
        userId: decode.nameid,
        courseId: data?.result?.item1?.courseId,
      };

      // if (user.id === useSelector((state) => state.authStore)) {
      //     setOwnMyCourse(true)
      // }

      console.log("trigger model",model)


      await CheckHasThisCourse(model).then((response) =>
        setIsEnrolledCourse(false)
      );
    }
    CheckActiveCourse();
  }, [isLoading]);

  if (isLoading || !course) {
    return <IsLoading></IsLoading>;
  }

  document
    .querySelectorAll("button[data-collapse-target]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.querySelector(
          `[data-collapse="${button.getAttribute("data-collapse-target")}"]`
        );
        target.style.height =
          target.style.height === "0px" ? `${target.scrollHeight}px` : "0px";
      });
    });

  return (
    <Fragment>
      <Navbar />
      <div className="container mx-auto flex flex-col sm:gap-5 gap-3 sm:px-28 mb-10">
        <PageTitle
          pageTitle={data.result.item1.courseName}
          pagesub={"Course"}
        />
        <div className="flex bg-gray-200 p-5 rounded-2xl sm:flex-row flex-col gap-4 ">
          {" "}
          <img
            src={data.result.item1.courseImage}
            alt=""
            className="rounded-md shadow-md sm:max-w-[550px] h-auto flex  order-1"
          />
          <div className="flex flex-col sm:px-3 justify-center sm:gap-3 gap-1 px-1 sm:p-1">
            <h1 className="text-2xl font-bold">
              {data.result.item1.courseName}
            </h1>
            <p className="text-black ">
              Learn WordPress & Elementor for Beginners On the other hand, we
              denounce with righteous indignation and dislike men who are so
              beguiled and demoralized by the charms of pleasure of the moment,
              so blinded by desire, that they cannot foresee the pain and
              trouble that are bound to ensue and equal blame belongs to those
              who fail in their duty through weaknes.
            </p>
            <div className="flex justify-end">
              {" "}
              {
                !isEnrolledCourse ? ( <Sidebar CourseDetail={course}></Sidebar>) : ( <button className="bg-themeOrange rounded-md w-32 text-white p-2 ">
                  Derse Başla{" "}
                </button>)
              }
             
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3  sm:gap-10 items-start  ">
          <div className="flex sm:flex-col flex-1 flex-col justify-beetwen sm:gap-8 gap-4">
            <CourseSingleAccardion courseDetail={course} />
            <Review />
          </div>
          <InstructorDetails instructor={data.result.item1.user} />
        </div>{" "}
        {/* <CoureseTab CoursesDetails={course} rate={data.result.item2} /> */}
        {/* {!isEnrolledCourse ? <Sidebar CourseDetail={course} /> : ""} */}
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};
export default CourseSinglePage;
