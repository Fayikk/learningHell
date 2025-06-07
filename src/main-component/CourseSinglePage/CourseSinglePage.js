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
      <div className="container mx-auto flex flex-col sm:gap-6 gap-4 sm:px-8 lg:px-16 xl:px-20 mb-12">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-4 rounded-lg shadow-sm">
          <Breadcrumbs
            steps={[
              {
                title: courseData?.courseName,
                to: `/course-single/${slug}`,
              },
            ]}
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mt-2">
          {/* Video ve Kurs Bilgileri */}
          <div className="lg:w-8/12 flex flex-col gap-6">
            {/* Video Bölümü */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative pt-[56.25%]">
                {courseData?.introductionVideoUrl ? (
                  <video
                    src={courseData?.introductionVideoUrl}
                    className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                    controls
                    poster={courseData?.coverImageUrl || ""}
                    preload="metadata"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Video mevcut değil</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Kurs içeriği */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{courseData?.courseName}</h1>
              
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
                  {courseData?.categoryName || "Kategori"}
                </span>
                {courseData?.level && (
                  <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium">
                    {courseData?.level} Seviye
                  </span>
                )}
                {courseData?.totalDuration && (
                  <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm font-medium">
                    {courseData?.totalDuration}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {courseData?.courseDescription}
              </p>
              
              {isEnrolledCourse ? (
                <div className="flex justify-end">
                  <button 
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1" 
                    onClick={triggerButton}
                  >
                    <i className="fas fa-play-circle mr-2"></i> Derse Başla
                  </button>
                </div>
              ) : courseData?.coursePrice === 0 ? (
                <div className="flex justify-end">
                  <button 
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1" 
                    onClick={giftCourseThisUser}
                  >
                    <i className="fas fa-graduation-cap mr-2"></i> Ücretsiz Kayıt Ol
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <Sidebar courseDetail={courseData}></Sidebar>
                </div>
              )}
            </div>
            
            {/* Kurs Müfredatı */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Kurs Müfredatı</h2>
              <CourseSingleAccardion courseDetail={course} />
            </div>
          </div>
          
          {/* Yan Bölüm - Eğitmen Bilgileri */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              <InstructorDetails instructor={data?.result?.item1?.user} />
              
              {/* İsteğe bağlı: Derecelendirmeler bölümü */}
              <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Kurs Detayları</h2>
                <ul className="space-y-3">
                  {courseData?.totalStudent && (
                    <li className="flex items-center gap-2">
                      <i className="fas fa-users text-blue-500"></i>
                      <span>{courseData.totalStudent} öğrenci</span>
                    </li>
                  )}
                  {courseData?.totalReview && (
                    <li className="flex items-center gap-2">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span>{courseData.totalReview} değerlendirme</span>
                    </li>
                  )}
                  {courseData?.createdDate && (
                    <li className="flex items-center gap-2">
                      <i className="fas fa-calendar text-green-500"></i>
                      <span>Son güncelleme: {new Date(courseData.createdDate).toLocaleDateString()}</span>
                    </li>
                  )}
                  {courseData?.language && (
                    <li className="flex items-center gap-2">
                      <i className="fas fa-globe text-purple-500"></i>
                      <span>Dil: {courseData.language}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Scrollbar /> 
    </Fragment>
  );
};

export default CourseSinglePage;
