import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Courses from "../../api/Courses";

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const CourseSectionS3 = (props) => {


    const [courses,setCourses] = useState([])
    useEffect(()=>{

        if (props.courses) {
            setCourses(props.courses)
        }
        
    },[props.courses])




    return (
        <div className={`wpo-popular-area section-padding ${props.pClass} course-section`}>
            <div className="container">
                <div className="wpo-popular-wrap">
                    <div className="row">
                        {courses.map((course, aitem) => (
                            <div className="col col-lg-4 col-md-6 col-12 course-card" key={aitem}>
                                <div className="wpo-popular-single">
                                    <div className="wpo-popular-item">
                                        <div className="wpo-popular-img">
                                            <img src={course.courseImage} alt="" />
                                            <div className="thumb">
                                                <span>&#8378;{course.coursePrice}</span>
                                            </div>
                                        </div>
                                        <div className="wpo-popular-content">
                                            <div className="wpo-popular-text-top">
                                                <ul>
                                                    <li><img src={course.author} alt="" /></li>
                                                    {/* <li><Link onClick={ClickHandler} to={`/team-single/${course.user.id }`}>{course.user.normalizedUserName}</Link></li> */}
                                                </ul>
                                                <ul>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li>({course.ratting})</li>
                                                </ul>
                                            </div>
                                            <h2><Link onClick={ClickHandler} to={props.component == "course" ?`/course-single/${course.courseId}` : `/Instructor/CourseDetail/${course.courseId}`}>{course.courseName}</Link>
                                            </h2>

                                            <div className="wpo-popular-text-bottom">
                                                <ul>
                                                    <li><i className="fi flaticon-reading-book"></i> {course.student} Students</li>
                                                    <li><i className="fi flaticon-agenda"></i> {course.lesson} Lesson</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  
                </div>
            </div>
        </div>
    );
}

export default CourseSectionS3;