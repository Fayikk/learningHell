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
import { useGetAllCoursesMutation } from '../../api/courseApi';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const CoursePage = () => {

    const {slug} = useParams();
 
    // const {data,isLoading} = useGetCoursesByCategoryIdQuery(slug);
    const [fetchAllDatas] = useGetAllCoursesMutation();
    const [courses,setCourses] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [pageCounter,setPageCounter] = useState(0);
    const [categoryId,setCategoryId] = useState(slug)
    const [filter,setFilter] = useState({
        filterProperty:"categoryId",
        filterValue:categoryId,
        pageSize:5,
        pageNumber:1
    })
   
    useEffect(()=>{
        // console.log("trigger course page")
        // console.log(data)
        // if (data)    {
        //     setCourses(data.result.courses)
        // }
        async function fetchData() {
            // You can await here
            await fetchAllDatas(filter).then((response) => {
                console.log("trigger inenr use effect")
                console.log(response)
                setCourses(response.data.result.data)
                // setCurrentPage(response.data.result.data)
                setPageCounter(response.data.result.pageCounter)
            })
            // ...
          }
          fetchData();
     
          

    },[filter])


    const handleClickChangePageNumber = (clickedPageNumber) => {
        setFilter((prevFilter) => ({
            ...prevFilter,      
            pageNumber: clickedPageNumber 
        }));
    };

    if (courses.length <=0 && pageCounter == 0) {
        console.log("trigger")
        return (
            <IsLoading></IsLoading>
        )
    }
    
    


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CourseSectionS3 courses={courses} />
            <div className="pagination-wrapper">
                        <ul className="pg-pagination">
                            {/* <li>
                                <Link to="/blog-left-sidebar" aria-label="Previous">
                                    <i className="fi ti-angle-left"></i>
                                </Link>
                            </li> */}
                            {
                                [...Array(pageCounter)].map((_, index) => (
                                    <li key={index} className={index === 0 ? "active" : ""}>
                                        <li className="active"><Button onClick={()=>handleClickChangePageNumber(index+1)} >{index + 1}</Button></li>
                                    </li>
                                ))
                              
                                //

                             
                            }
                            {/* <li>
                                <Link to="/blog-left-sidebar" aria-label="Next">
                                    <i className="fi ti-angle-right"></i>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePage;
