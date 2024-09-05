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
import RightArrowIcon from "../../icons/RightArrowIcon";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const CourseSinglePage = (props) => {
  const { slug } = useParams();
  const { data, isLoading } = useGetCourseDetailByIdQuery(slug);
  const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
  const [ownMyCourse, setOwnMyCourse] = useState(false);
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [course, setCourse] = useState();
  const [open, setOpen] = React.useState([]);
  const [cart, setCart] = useState(true);
  const authenticationState = useSelector(
    (state) => state.authStore.nameIdentifier
  );
  const courseData = data?.result?.item1;

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

      await CheckHasThisCourse(model).then((response) =>
        setIsEnrolledCourse(response.data)
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
        <Breadcrumbs
          steps={[
            {
              title: courseData?.courseName,
              to: `/course-single/${slug}`,
            },
          ]}
        />
        <div className="flex justify-between bg-gray-200 p-5 rounded-2xl sm:flex-row flex-col gap-4 ">
          {" "}
          <img
            src={courseData?.courseImage}
            alt=""
            className="rounded-md shadow-md sm:max-w-[550px] h-auto flex  order-1"
          />
          <div className="flex flex-col  justify-center  gap-2 px-1">
            <h1 className="text-2xl font-bold">{courseData?.courseName}</h1>
            <p className="text-black ">{courseData?.courseDescription}</p>

            {cart ? (
              <div className="flex justify-end ">
                <button className="theme-btn-s2">Derse Başla</button>
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="flex items-center  gap-2">
                  <span className="text-xl font-bold text-black rounded-full p-4 bg-themeOrange px-3 ">
                    {courseData?.coursePrice.toFixed(2)} ₺
                  </span>
                  <span className="text-black/75 text-[15px]">Language:</span>
                  <span className="text-black/75 font-bold text-[15px]">
                    {courseData?.courseLanguage}
                  </span>
                </div>
                <div className="flex justify-end items-center">
                  <button className="theme-btn-s3">Add To Cart</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3  sm:gap-10 items-start  ">
          <div className="flex sm:flex-col flex-1 flex-col justify-beetwen sm:gap-8 gap-4">
            <CourseSingleAccardion />
            <Review />
          </div>
          <InstructorDetails courseName={courseData?.courseName} />
        </div>{" "}
        <CoureseTab CoursesDetails={course} rate={data.result.item2} />
        {!isEnrolledCourse ? <Sidebar CourseDetail={course} /> : ""}
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};
export default CourseSinglePage;
