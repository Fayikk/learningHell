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
import IsLoading from '../../components/Loading/IsLoading';


const CoursePage = () => {

    const {slug} = useParams();

    const {data,isLoading} = useGetCoursesByCategoryIdQuery(slug);
    const [courses,setCourses] = useState([])

    useEffect(()=>{
        if (data)    {
            setCourses(data.result.courses)
        }


    },[isLoading])

    if (isLoading) {
        return (
            <IsLoading></IsLoading>
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
