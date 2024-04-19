import React, { useEffect } from 'react';
import {Link} from 'react-router-dom'
import BlogSidebar from '../BlogSidebar/BlogSidebar.js'
import VideoModal from '../ModalVideo/VideoModal'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import blogs from '../../api/blogs'
import { useIsCourseHaveStudentMutation } from '../../api/studentCourseApi.js';

const ClickHandler = () =>{
    window.scrollTo(10, 0);
 }

const BlogList = (props) => {


    const authenticationState = useSelector((state) => state.authStore);
    const [GetMyCourses] = useIsCourseHaveStudentMutation();
    const [myCourse,setMyCourse] = useState(); 

    useEffect(() => {
        const getMyCourses = async () => {
            if (authenticationState.nameIdentifier) {
                try {
                    const response = await GetMyCourses(authenticationState.nameIdentifier);
                    setMyCourse(response.data.result);
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            }
        };
    
        getMyCourses();
    
        return () => {
            // Cleanup function
            // Eğer asenkron işlemler iptal edilmeliyse, burada iptal edebilirsiniz.
        };
    }, [authenticationState]);
    
    


 







    return(
        <section className="wpo-blog-pg-section section-padding">
            <div className={`wpo-popular-area section-padding ${props.pClass}`}>
           <div className="container">
                <div className="wpo-popular-wrap">
                    <div className="row">
                            { myCourse &&  myCourse.courses.map((course, key) => (
                                <>
                                <Link onClick={ClickHandler} to={`/course-single/${course.courseId}`}>
                                   <div className="col col-lg-4 col-md-6 col-12" key={key}>
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
                                                <ul>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li>({course.ratting})</li>
                                                </ul>
                                            </div>
                                           {course.courseName}
                                           

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
                            </Link>

                                </>
                            ))}

                            <div className="pagination-wrapper pagination-wrapper-left">
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
                            </div>
                        </div>
                    </div>
                    <BlogSidebar blLeft={props.blLeft}/>
                </div>
                </div>
        </section>

     )
        
}

export default BlogList;
