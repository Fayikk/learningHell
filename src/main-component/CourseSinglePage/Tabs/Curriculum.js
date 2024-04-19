import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {  useThisCourseEnrolledUserMutation } from '../../../api/studentCourseApi'
import { useSelector } from 'react-redux'
import {toast} from "react-toastify";

const Curriculum = ({sections}) => {

    const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();
    const authenticationState = useSelector((state) => state.authStore);
    const [sectionsData,setSectionsData] = useState([]);
    const [isEnrolledCourse,setIsEnrolledCourse] = useState(false);

    useEffect(()=>{
        if (sections.Length > 0) {
        setSectionsData(sections)
            
        }
    },[sections])

    useEffect(()=>{
            async function CheckActiveCourse(){

                const model = {
                    userId:authenticationState.nameIdentifier,
                    courseId:sections[0].courseId
                }


                var response = await  CheckHasThisCourse(model)
                 setIsEnrolledCourse(response.data)
              }
                CheckActiveCourse();
                
            
    },[authenticationState,sections])

    const ClickHandler = () => {
        if (!isEnrolledCourse) {
            toast.warning("You must have purchased the course to watch it.")
            return;
        }

        window.scrollTo(10, 0);
    }



    
    return (
        <div className="wpo-course-content">
            <div className="wpo-course-text-top">
                <h2>Starting Beginners Level Course</h2>
                <div className="course-b-text mt-1">
                    <p>On the other hand, we denounce with righteous indignation
                        and dislike men who are so beguiled and demoralized by
                        the charms of pleasure of the moment, so blinded by
                        desire, that they cannot foresee the pain and trouble
                        that are bound to ensue and equal blame belongs to those
                        who fail in their duty through weakness of will, which
                        is the same as saying through shrinking from toil and
                        pain.</p>
                </div>
                <div className="course-curriculam">
                    <ul>
                        {
                            isEnrolledCourse ? (
                                sections.map((section,key) => (
                                    <li key={key} ><span><i className="fi flaticon-play-button"></i> {section.sectionName} <Link onClick={()=>ClickHandler(section.sectionId)} to={`/lessons/${section.sectionId}`}>Preview</Link></span><small>20 Minutes</small></li>
    
                                ))
                            ) : (
                                sections.map((section,key) => (
                                    <li key={key} ><span><i className="fi flaticon-play-button"></i> {section.sectionName} <a onClick={()=>ClickHandler(section.sectionId)} >Locked</a></span><small>20 Minutes</small></li>
    
                                ))
                            )
                           
                        }
                        
                    </ul>
                </div>
            </div>
            <div className="wpo-course-text-top">
                <h2>Intermediate Level Course</h2>
                <div className="course-b-text mt-1">
                    <p>On the other hand, we denounce with righteous indignation
                        and dislike men who are so beguiled and demoralized by
                        the charms of pleasure of the moment, so blinded by
                        desire, that they cannot foresee the pain and trouble
                        that are bound to ensue and equal blame belongs to those
                        who fail in their duty through weakness of will, which
                        is the same as saying through shrinking from toil and
                        pain.</p>
                </div>
                <div className="course-curriculam">
                    <ul>
                        <li><span><i className="fi flaticon-play-button"></i>Introduction of Editing<Link onClick={ClickHandler} to="/lesson">Preview</Link></span><small>20 Minutes</small></li>
                        <li><span><i className="fi flaticon-e-learning"></i>Basic Editing Technology</span></li>
                        <li><span><i className="fi flaticon-knowledge"></i>Quiz</span><small>5 Questions</small></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Curriculum;