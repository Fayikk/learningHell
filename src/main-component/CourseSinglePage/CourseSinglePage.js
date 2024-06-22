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
import { useThisCourseEnrolledUserMutation } from '../../api/studentCourseApi';
import { useSelector } from 'react-redux';
const CourseSinglePage = (props) => {
    const { slug } = useParams()
    const {data,isLoading} = useGetCourseDetailByIdQuery(slug);
    const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
    const [ownMyCourse,setOwnMyCourse] = useState(false);
    const [isEnrolledCourse,setIsEnrolledCourse] = useState(false);
    const [course,setCourse] = useState()
    const authenticationState = useSelector((state) => state.authStore.nameIdentifier);

    useEffect(()=>{
        if (data) {
            console.log("trigger",data.result.courseId)
            setCourse(data.result)
        }

        async function CheckActiveCourse(){
            const model = {
                userId:authenticationState,
                courseId:data.result.courseId 
            }
            // if (user.id === useSelector((state) => state.authStore)) {
            //     setOwnMyCourse(true)
            // }


             await  CheckHasThisCourse(model).then((response) =>setIsEnrolledCourse(response.data))
            
            //  
          }
            CheckActiveCourse();


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
                        {
                            !isEnrolledCourse ? (
                        <Sidebar CourseDetail = {course} />

                            ) : ("")
                        }
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CourseSinglePage;
