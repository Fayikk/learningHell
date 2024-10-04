import React, {Fragment, useEffect, useState} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/hero/hero';
import CourseSection from '../../components/CourseSection/CourseSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import ChooseSection from '../../components/ChooseSection/ChooseSection';
import Newslatter from '../../components/Newslatter/Newslatter';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import { useGetCourseIntroductionVideosQuery, useGetMostPopularCoursesQuery } from '../../api/courseApi';
import IsLoading from '../../components/Loading/IsLoading';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import { useTranslation } from 'react-i18next';
const HomePage =() => {
    const [mostPopularCourses,setMostPopularCourses] = useState();
    const {data,isLoading} = useGetMostPopularCoursesQuery();



    useEffect(()=>{
        if (data) {
            setMostPopularCourses(data.result)
            
        }
    },[data])


    if (isLoading) {
        return (
            <IsLoading></IsLoading>
        )
    }



    // if (isLoading) {
    //     return (
    //        <IsLoading></IsLoading>
    //     )
    // }
    // if (!introductionVideos) {
    //     return <div>Veri yükleniyor...</div>;
    //   }

    //
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-4'}/>
            {/* <Hero introductionVideos = {introductionVideos} /> */}
            {/* <About/> */}
            {/* <CategorySection/> */}
            <CourseSection popularCourses={mostPopularCourses} />
            {/* <Testimonial/> */}
            {/* <TeamSection pbClass={'pb-big'}/> */}
            {/* <ChooseSection/> */}
            {/* <BlogSection/> */}
            <Newslatter2/>
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage;