import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
import { useScrollTrigger } from '@mui/material';
import { useGetCoursesByCategoryIdQuery } from '../../api/categoryApi';
const CoursePage = () => {

    const {slug} = useParams();

    const {data,isLoading} = useGetCoursesByCategoryIdQuery(slug);
    const [courses,setCourses] = useState([])

    useEffect(()=>{
        if (data)    {
            setCourses(data.result.courses)
        }

        console.log(data)

    },[isLoading])

    if (isLoading) {
        return (
            <div>
                <h1>
                    <span>...isLoading</span>
                </h1>
            </div>
        )
    }
    
    


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CourseSectionS3 courses={data.result.courses} />
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePage;
