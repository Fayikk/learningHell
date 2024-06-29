import React, { useEffect } from 'react';
import { useState } from 'react';
import { useGetEvaluateCoursesQuery } from '../../api/courseApi.js';
import IsLoading from '../../components/Loading/IsLoading.js';
import { Link } from 'react-router-dom';
const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const CoursesInEvaluation = (props) => {

    // const authenticationState = useSelector((state) => state.authStore);
    // const [GetMyCourses] = useIsCourseHaveStudentMutation();
    const [evaluatedCourse, setEvaluatedCourse] = useState(); 
    const {data,isLoading} = useGetEvaluateCoursesQuery();

    useEffect(() => {
        // const getMyCourses = async () => {
        //     if (authenticationState.nameIdentifier) {
        //         try {
        //             const response = await GetMyCourses(authenticationState.nameIdentifier);
        //             setMyCourse(response.data.result);
        //         } catch (error) {
        //             console.error("Error fetching courses:", error);
        //         }
        //     }
        // };
    
        // getMyCourses();
        // authenticationState
        setEvaluatedCourse(data)

    }, [data]);
    if(isLoading)
        {
            return (<IsLoading></IsLoading>)
        }

    return (
        <section className="wpo-blog-pg-section section-padding">
            <div className={`wpo-popular-area section-padding ${props.pClass}`}>
                <div className="container">
                    <div className="wpo-popular-wrap">
                        <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {evaluatedCourse && evaluatedCourse.result.map((course, key) => (
                                <Link onClick={ClickHandler} to={`/Instructor/CourseDetail/${course.courseId}`} key={key} style={{ flex: '0 0 33.333333%', maxWidth: '33.333333%' }}>
                                    <div className="wpo-popular-single">
                                        <div className="wpo-popular-item">
                                            <div className="wpo-popular-img">
                                                <img src={course.courseImage} alt="" />
                                                {/* <div className="thumb">
                                                    <span>${course.coursePrice}</span>
                                                </div> */}
                                            </div>
                                            <div className="wpo-popular-content">
                                                <div className="wpo-popular-text-top">
                                                    <ul>
                                                        <li><img src={course.author} alt="" /></li>
                                                        {/* <li><Link onClick={ClickHandler} to={`/team-single/${course.courseId }`}>{course.user.normalizedUserName}</Link></li> */}
                                                    </ul>
                                                  
                                                </div>
                                                {course.courseName}
                                                <div className="wpo-popular-text-bottom">
                                                    <ul>
                                                        <li style={{color:"red"}} ><i className="fi flaticon-reading-book"></i> {course.user.email} Email</li>
                                                        <li style={{color:"yellowgreen"}} ><i className="fi flaticon-agenda"></i> {course.user.fullName} FullName</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* <div className="pagination-wrapper pagination-wrapper-left">
                            <ul className="pg-pagination">
                                <li>
                                    <Link to="/blog-left-sidebar" aria-label="Previous">
                                        <i className="fi ti-angle-left"></i>
                                    </Link>
                                </li>
                                <li className="active"><Link to="/blog-left-sidebar">1</Link></li>
                                <li><Link to="/blog-left-sidebar">2</Link></li>
                                <li><Link to="/blog-left-sidebar">3</Link></li>
                                <li>
                                    <Link to="/blog-left-sidebar" aria-label="Next">
                                        <i className="fi ti-angle-right"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CoursesInEvaluation;
