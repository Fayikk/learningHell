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
  const [currentSlide, setCurrentSlide] = useState(0);
  const authenticationState = useSelector(
    (state) => state.authStore
  );
  const courseData = data?.result?.item1;
  const reviews = [
    {
      name: "Ahmet Yılmaz",
      rating: 5,
      comment: "Harika bir kurs! Anlatım çok net ve konular çok iyi organize edilmiş. Eğitmen gerçekten işinin ehli."
    },
    {
      name: "Zeynep Kaya",
      rating: 5,
      comment: "Bu kursu aldığım için çok mutluyum. Kariyer gelişimime büyük katkı sağladı. Kesinlikle tavsiye ediyorum!"
    },
    {
      name: "Mehmet Demir",
      rating: 4,
      comment: "Pratik örneklerle desteklenmiş, çok verimli bir eğitim. Her seviyeye uygun içerik bulunuyor."
    },
    {
      name: "Ayşe Şahin",
      rating: 5,
      comment: "Eğitmenin anlatım tarzı ve örnekleri çok başarılı. Sıfırdan başlayanlar için ideal bir kurs."
    },
    {
      name: "Mustafa Özkan",
      rating: 5,
      comment: "Konular çok detaylı işlenmiş. Özellikle proje odaklı yaklaşım çok faydalı oldu."
    },
    {
      name: "Elif Yıldız",
      rating: 4,
      comment: "Sektörde ihtiyaç duyulan tüm konular ele alınmış. Güncel ve kapsamlı bir eğitim."
    },
    {
      name: "Can Aydın",
      rating: 5,
      comment: "Eğitmenin tecrübesi ve bilgi birikimi derslere çok iyi yansımış. Sorularımıza hızlı dönüş aldık."
    },
    {
      name: "Selin Arslan",
      rating: 5,
      comment: "Kurs materyalleri ve ödevler çok öğretici. Pratik yapma imkanı oldukça fazla."
    },
    {
      name: "Burak Çelik",
      rating: 4,
      comment: "Modern teknolojiler ve güncel yaklaşımlar çok iyi anlatılmış. Kendimi geliştirmeme çok yardımcı oldu."
    },
    {
      name: "Deniz Koç",
      rating: 5,
      comment: "Teorik bilgiler pratik uygulamalarla pekiştirilmiş. Çok verimli bir eğitim süreci geçirdim."
    },
    {
      name: "Gözde Akın",
      rating: 5,
      comment: "İş hayatımda kullanabileceğim çok değerli bilgiler edindim. Eğitmen sürekli destek sağladı."
    },
    {
      name: "Onur Yılmaz",
      rating: 5,
      comment: "Kurs içeriği çok zengin ve güncel. Gerçek projelerle öğrenme fırsatı bulduk."
    }
  ];
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
  
  const carouselStyles = {
    carousel: {
      position: 'relative',
      perspective: '1000px',
      transformStyle: 'preserve-3d',
      overflow: 'hidden',
      padding: '20px 0',
    },
    track: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      gap: '20px',
    },
    card: {
      flex: '0 0 100%',
      transition: 'all 0.5s ease-in-out',
    },
    activeCard: {
      opacity: 1,
      transform: 'scale(1)',
      filter: 'blur(0)',
    },
    inactiveCard: {
      opacity: 0.5,
      transform: 'scale(0.95)',
      filter: 'blur(2px)',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.3s ease',
    },
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
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-users text-blue-500 text-lg w-6"></i>
                    <div>
                      <span className="font-semibold block">350 Öğrenci</span>
                      <span className="text-sm text-gray-500">Bu kursa kayıtlı</span>
                    </div>
                  </li>                 <li className="flex items-center gap-3">
                    <i className="fas fa-file-video text-green-500 text-lg w-6"></i>
                    <div>
                      <span className="font-semibold block">{course?.sections?.reduce((total, section) => total + section.videos?.length, 0) || '0'} Video</span>
                      <span className="text-sm text-gray-500">Detaylı anlatım</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-certificate text-yellow-500 text-lg w-6"></i>
                    <div>
                      <span className="font-semibold block">Sertifika</span>
                      <span className="text-sm text-gray-500">Tamamlama belgesi</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-infinity text-red-500 text-lg w-6"></i>
                    <div>
                      <span className="font-semibold block">Ömür Boyu Erişim</span>
                      <span className="text-sm text-gray-500">İstediğin zaman tekrar et</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-mobile-alt text-indigo-500 text-lg w-6"></i>
                    <div>
                      <span className="font-semibold block">Mobil Erişim</span>
                      <span className="text-sm text-gray-500">Her cihazdan izle</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Öğrenci Yorumları Carousel */}
              <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Öğrenci Yorumları</h2>
                <div className="relative">
                  <div className="review-carousel overflow-hidden">
                    <div className="carousel-track flex transition-transform duration-300" style={{transform: `translateX(${currentSlide * -100}%)`}}>
                      {reviews.map((review, index) => (
                        <div 
                          key={index}
                          className={`review-card min-w-full transition-all duration-300 ${
                            Math.abs(currentSlide - index) <= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95 blur-sm'
                          }`}
                        >
                          <div className="bg-gray-50 rounded-xl p-6 mx-4 transform transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                                {review.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <h3 className="font-semibold text-lg">{review.name}</h3>
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 italic">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev - 1 + reviews.length) % reviews.length)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-left text-gray-600"></i>
                  </button>
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev + 1) % reviews.length)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-right text-gray-600"></i>
                  </button>
                  <div className="flex justify-center mt-4 gap-2">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlide === index ? 'bg-blue-500 w-4' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
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
