import React, { Fragment,useEffect,useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import Courses from "../../api/Courses";
import Footer from '../../components/footer/Footer';
import CoureseTab from './Tabs/CoureseTab';
import Sidebar from './sidebar';
import { useGetCoursesByCategoryIdQuery } from '../../api/categoryApi';
import { useGetCourseDetailByIdQuery } from '../../api/courseApi';

const CourseSinglePage = (props) => {
    const { slug } = useParams()
    const {data,isLoading} = useGetCourseDetailByIdQuery(slug);
    const [course,setCourse] = useState()
    console.log("course single page")
    console.log(data)
    useEffect(()=>{
        if (data) {
            setCourse(data.result)
        }
    },[isLoading])
    
    if (isLoading || !course ) {
        return (
            <div><span>...isLoading</span></div>
        )
    }
    
   
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={data.result.courseName} pagesub={'Course'} />
            <div className="wpo-course-details-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-8">
                            <div className="wpo-course-details-wrap">
                                <div className="wpo-course-details-img">
                                    <img src={data.result.courseImage} alt="" />
                                </div>
                                <CoureseTab CoursesDetails={course} />
                            </div>
                        </div>
                        <Sidebar CourseDetail = {course} />
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CourseSinglePage;
