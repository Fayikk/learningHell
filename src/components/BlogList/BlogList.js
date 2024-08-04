import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogSidebar from '../BlogSidebar/BlogSidebar.js';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useIsCourseHaveStudentMutation } from '../../api/studentCourseApi.js';
import  {calculateAverageRating}  from "../../Helpers/calculateAverageRating";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const BlogList = (props) => {

    const [GetMyCourses] = useIsCourseHaveStudentMutation();
    const [myCourse, setMyCourse] = useState(); 
    console.log("trigger blog list",props.nameIdentifier.nameIdentifier)
    const [filter,setFilter] = useState({
        isSearch:true,
        pageIndex:1,
        pageSize:6,
        sortColumn:"CreatedDate",
        sortOrder:"desc",
        filters:{
            groupOp:"AND",
            rules:[
                {
                    field:"UserId",
                    op:1,
                    data:""
                }
            ]
        }        
    })




    

    useEffect(() => {
        const getMyCourses = async () => {
            
                try {
                     await GetMyCourses(filter).then((response) => {
                        console.log("get my courses",response.data.result.data[0].courses),
                        setMyCourse(response.data.result.data[0].courses)

                    });
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            
                
        };
    
        getMyCourses();
    }, [filter]);



    return (
        <section className="wpo-blog-pg-section section-padding">
            <div className={`wpo-popular-area section-padding ${props.pClass}`}>
                <div className="container">
                    <div className="wpo-popular-wrap">
                        <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {myCourse && myCourse.map((course, key) => (
                                <Link onClick={ClickHandler} to={`/course-single/${course.courseId}`} key={key} style={{ flex: '0 0 33.333333%', maxWidth: '33.333333%' }}>
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
                                                        <li>({calculateAverageRating(course.ratings)})</li>
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
                    <BlogSidebar blLeft={props.blLeft}/>
                </div>
            </div>
        </section>
    );
}

export default BlogList;
