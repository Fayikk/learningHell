import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Courses from "../../api/Courses";
import { calculateAverageRating } from "../../Helpers/calculateAverageRating";
import { MatchLocationToCurrency } from "../../main-component/Extensions/MatchLocationToCurrency";
import Cookies from 'js-cookie';
import Search from "../Search/Search";
import "./styles/CourseSectionS3.css"
const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const CourseSectionS3 = (props) => {
    const handleClickedChildToParent = (courseId) => {
        props.onData(courseId);
    }

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        if (props.courses) {
            setCourses(props.courses);
        }
    }, [props.courses]);

    return (
        <div className={`wpo-popular-area section-padding ${props.pClass} course-section`}>
            <div style={{ marginBottom: "50px" }}></div>
            <div className="container">
                <div className="wpo-popular-wrap">
                    <div className="row">
                        {courses.map((course, index) => (
                            <div className="col col-lg-4 col-md-6 col-12 course-card" key={index}>
                                <div className="wpo-popular-single">
                                    <div className="wpo-popular-item">
                                        <div className="wpo-popular-img">
                                            <img src={course.courseImage} alt="" className="course-image" />
                                            <div className="thumb">
                                                <span>{MatchLocationToCurrency()}{course.coursePrice}</span>
                                            </div>
                                        </div>
                                        <div className="wpo-popular-content">
                                            <div className="wpo-popular-text-top">
                                                <ul>
                                                    <li><img src={course.author} alt="" /></li>
                                                </ul>
                                                <ul>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li>({calculateAverageRating(course.ratings)})</li>
                                                </ul>
                                            </div>
                                            <h2>
                                                <Link onClick={ClickHandler} to={props.component === "course" ? `/course-single/${course.courseId}` : `/Instructor/CourseDetail/${course.courseId}`}>
                                                    {course.courseName}
                                                </Link>
                                                {props.component === "instructor" && (
                                                    <button className="btn btn-success" onClick={() => handleClickedChildToParent(course.courseId)}>Düzenle</button>
                                                )}
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
