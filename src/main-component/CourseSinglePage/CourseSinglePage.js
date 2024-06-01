import React, { Fragment,useEffect,useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import Footer from '../../components/footer/Footer';
import CoureseTab from './Tabs/CoureseTab';
import Sidebar from './sidebar';
import { useGetCourseDetailByIdQuery } from '../../api/courseApi';
import IsLoading from '../../components/Loading/IsLoading';

const CourseSinglePage = (props) => {
    const { slug } = useParams()
    console.log("trigger course slug")
    console.log(slug)
    const {data,isLoading} = useGetCourseDetailByIdQuery(slug);
    const [course,setCourse] = useState()
    useEffect(()=>{
        if (data) {
            
            setCourse(data.result)
        }
    },[isLoading])
    
    if (isLoading || !course ) {
        return (
            <IsLoading></IsLoading>
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
