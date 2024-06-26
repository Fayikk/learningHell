import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
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
const AllRoute = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          {/* <Route path="home-2" element={<HomePage2 />} /> */}
          {/* <Route path="home-3" element={<HomePage3 />} /> */}
          {/* <Route path="home-4" element={<HomePage4 />} /> */}
          {/* <Route path="home-5" element={<HomePage5 />} /> */}
          <Route path="about" element={<AboutPage />} />
          <Route path="category-single/:slug" element={<CategorySinglePage />} />
          <Route path="course-single/:slug" element={<CourseSinglePage />} />
          <Route path="course/:slug" element={<CoursePage />} />
          <Route path="course-2" element={<CoursePageS2 />} />
          {/* <Route path="course-3" element={<CoursePageS3 />} /> */}
          <Route path="lessons/:sectionId" element={<LessonPage />} />
          <Route path='TeacherApplications' element={<TeacherApplications></TeacherApplications>} ></Route>
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="testimonial" element={<TestimonialPage />} />
          <Route path="teacher" element={<TeamPage />} />
          <Route path="Instructor" element={<InstructorDetail />} />
          <Route path="Instructor/CourseDetail/:slug" element={<InstructorsCourseDetail />} />
          <Route path="team-single/:slug" element={<TeamSinglePage />} />
          <Route path="event-single/:slug" element={<EventSinglePage />} />
          <Route path='become-teacher' element={<BeComeTeacherPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path='product-single/:slug' element={<ProductSinglePage />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='supervisor/evaluatecourses' element={<EvaluateCourses></EvaluateCourses>} ></Route>
          <Route path='order_received' element={<OrderRecived />} />
          <Route path='faq' element={<FaqPage />} />
          <Route path='privacy' element={<PrivacyPage/>} />
          <Route path='terms' element={<TermsPage/>} />
          <Route path='blog' element={<BlogPage />} />
          <Route path='blog-left-sidebar' element={<BlogPageLeft />} />
          <Route path='MyCourse' element={<MyCourses />} />
          <Route path='blog-single/:slug' element={<BlogDetails />} />
          <Route path='blog-single-left-sidebar/:slug' element={<BlogDetailsLeftSiide />} />
          <Route path='blog-single-fullwidth/:slug' element={<BlogDetailsFull />} />
          <Route path='ErrorPage/:slug' element={<ErrorPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<SignUpPage />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='verify-email/:slug' element={<VerifyEmail></VerifyEmail>} ></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
