import React from 'react';
import { BrowserRouter, Routes, Route,Switch } from "react-router-dom";
import Homepage from '../HomePage/HomePage'
import CategorySinglePage from '../CategorySinglePage/CategorySinglePage';
import CoursePage from '../CoursePage/CoursePage';
import CoursePageS2 from '../CoursePageS2/CoursePageS2';
import CourseSinglePage from '../CourseSinglePage/CourseSinglePage';
import AboutPage from '../AboutPage/AboutPage';
import TestimonialPage from '../TestimonialPage/TestimonialPage';
import TeamPage from '../TeamPage/TeamPage';
import TeamSinglePage from '../TeamSinglePage/TeamSinglePage';
import EventSinglePage from '../EventSinglePage/EventSinglePage';
import GalleryPage from '../GalleryPage/GalleryPage';
import ShopPage from '../ShopPage'
import ProductSinglePage from '../ProductSinglePage';
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import OrderRecived from '../OrderRecived';
import BlogPage from '../BlogPage/BlogPage'
import BlogPageLeft from '../BlogPageLeft/BlogPageLeft'
import BlogDetails from '../BlogDetails/BlogDetails'
import BlogDetailsFull from '../BlogDetailsFull/BlogDetailsFull'
import BlogDetailsLeftSiide from '../BlogDetailsLeftSiide/BlogDetailsLeftSiide'
import ContactPage from '../ContactPage/ContactPage';
import FaqPage from '../FaqPage';
import BeComeTeacherPage from '../BeComeTeacherPage/BeComeTeacherPage';
import LessonPage from '../LessonPage/LessonPage';
import PrivacyPage from '../PrivacyPage/PrivacyPage';
import TermsPage from '../TermsPage/TermsPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoginPage from '../LoginPage';
import SignUpPage from '../SignUpPage';
import ForgotPassword from '../ForgotPassword';
import MyCourses from '../BlogPageFullwidth/MyCourses';
import InstructorDetail from '../Instructor/InstructorDetail';
import InstructorsCourseDetail from '../Instructor/InstructorsCourseDetail';
import TeacherApplications from '../SuperVisor/TeacherApplications';
import VerifyEmail from '../Verification/VerifyEmail';
import EvaluateCourses from '../Evaluate/EvaluateCourses';
import VerifyDigitCode from '../Verification/VerifyDigitCode';
import { AuthProvider } from '../Extensions/AuthProvider';
import PrivateRoute from '../Extensions/PrivateRoute';
import MyAccount from '../Account/MyAccount';
import PrivateEnrolledCourseRoute from '../Extensions/PrivateEnrolledCourseRoute';
import TagsManagement from '../../components/Tags/TagsManagement';
import NewsManagement from '../../components/News/NewsManagement';
import NewsPortal from '../../components/News/NewsPortal';
import GoogleTag from '../../Extensions/GoogleTag'; // Import the GoogleTag component

const AllRoute = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><GoogleTag /><Homepage /></>} />
          <Route path="home" element={<><GoogleTag /><Homepage /></>} />
          {/* <Route path="home-2" element={<><GoogleTag /><HomePage2 /></>} /> */}
          {/* <Route path="home-3" element={<><GoogleTag /><HomePage3 /></>} /> */}
          {/* <Route path="home-4" element={<><GoogleTag /><HomePage4 /></>} /> */}
          {/* <Route path="home-5" element={<><GoogleTag /><HomePage5 /></>} /> */}
          <Route path="about" element={<><GoogleTag /><AboutPage /></>} />
          <Route path="category-single/:slug" element={<><GoogleTag /><CategorySinglePage /></>} />
          <Route path="course-single/:slug" element={<><GoogleTag /><CourseSinglePage /></>} />
          <Route path="course/:slug" element={<><GoogleTag /><CoursePage /></>} />
          <Route path="course-2" element={<><GoogleTag /><CoursePageS2 /></>} />
          {/* <Route path="course-3" element={<><GoogleTag /><CoursePageS3 /></>} /> */}
          <Route path="lessons/:courseId" element={<PrivateEnrolledCourseRoute><GoogleTag /><LessonPage /></PrivateEnrolledCourseRoute>} />
          <Route path='TeacherApplications' element={<><GoogleTag /><TeacherApplications /></>} />
          <Route path="gallery" element={<><GoogleTag /><GalleryPage /></>} />
          <Route path="testimonial" element={<><GoogleTag /><TestimonialPage /></>} />
          <Route path="teacher" element={<><GoogleTag /><TeamPage /></>} />
          <Route path="Instructor" element={<><GoogleTag /><InstructorDetail /></>} />
          <Route path="Instructor/CourseDetail/:slug" element={<><GoogleTag /><InstructorsCourseDetail /></>} />
          <Route path="team-single/:slug" element={<><GoogleTag /><TeamSinglePage /></>} />
          <Route path="event-single/:slug" element={<><GoogleTag /><EventSinglePage /></>} />
          <Route path='become-teacher' element={<PrivateRoute><GoogleTag /><BeComeTeacherPage /></PrivateRoute>} />
          <Route path="shop" element={<><GoogleTag /><ShopPage /></>} />
          <Route path='product-single/:slug' element={<><GoogleTag /><ProductSinglePage /></>} />
          <Route path='cart' element={<PrivateRoute><GoogleTag /><CartPage /></PrivateRoute>} />
          <Route path='checkout' element={<><GoogleTag /><CheckoutPage /></>} />
          <Route path='supervisor/evaluatecourses' element={<><GoogleTag /><EvaluateCourses /></>} />
          <Route path='order_received' element={<><GoogleTag /><OrderRecived /></>} />
          <Route path='faq' element={<><GoogleTag /><FaqPage /></>} />
          <Route path='privacy' element={<><GoogleTag /><PrivacyPage /></>} />
          <Route path='terms' element={<><GoogleTag /><TermsPage /></>} />
          {/* <Route path='blog' element={<><GoogleTag /><BlogPage /></>} /> */}
          <Route path='blog-left-sidebar' element={<><GoogleTag /><BlogPageLeft /></>} />
          <Route path='MyCourse' element={<><GoogleTag /><MyCourses /></>} />
          <Route path='blog-single/:slug' element={<><GoogleTag /><BlogDetails /></>} />
          <Route path='blog-single-left-sidebar/:slug' element={<><GoogleTag /><BlogDetailsLeftSiide /></>} />
          <Route path='blog-single-fullwidth/:slug' element={<><GoogleTag /><BlogDetailsFull /></>} />
          <Route path='ErrorPage/:slug' element={<><GoogleTag /><ErrorPage /></>} />
          <Route path='contact' element={<><GoogleTag /><ContactPage /></>} />
          <Route path='login' element={<><GoogleTag /><LoginPage /></>} />
          <Route path='register' element={<><GoogleTag /><SignUpPage /></>} />
          <Route path='forgot-password' element={<><GoogleTag /><ForgotPassword /></>} />
          <Route path='verify-email/:slug' element={<><GoogleTag /><VerifyEmail /></>} />
          <Route path='verify-digit/:slug' element={<><GoogleTag /><VerifyDigitCode /></>} />
          <Route path='MyAccount' element={<><GoogleTag /><MyAccount /></>} />
          <Route path="/admin/tags" element={<><GoogleTag /><TagsManagement /></>} />
          <Route path="/admin/news" element={<><GoogleTag /><NewsManagement /></>} />
          <Route path="/blogs" element={<><GoogleTag /><NewsPortal /></>} />
          <Route path="/news/category/:category" element={<><GoogleTag /><NewsPortal /></>} />
          <Route path="/news/tag/:tagName" element={<><GoogleTag /><NewsPortal /></>} />
          <Route path="/news/search" element={<><GoogleTag /><NewsPortal /></>} />
          <Route path="/news/:slug" element={<><GoogleTag /><NewsPortal /></>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AllRoute;
