import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
import IsLoading from '../../components/Loading/IsLoading';
import { useGetAllCoursesMutation } from '../../api/courseApi';
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
        isSearch:true,
        pageIndex:1,
        pageSize:6,
        sortColumn:"CourseName",
        sortOrder:"desc",
        filters:{
            groupOp:"AND",
            rules:[
                {
                    field:"CourseEvaluteStatus",
                    op:1,
                    data:"3"
                }
            ]
        }        
    })

    // filterProperty:"categoryId",
    // filterValue:categoryId,
    // pageSize:6,
    // pageNumber:1

    // {
    //     "isSearch": true,
    //     "pageIndex": 0,
    //     "pageSize": 0,
    //     "sortColumn": "string",
    //     "sortOrder": "string",
    //     "filters": {
    //       "groupOp": "string",
    //       "rules": [
    //         {
    //           "field": "string",
    //           "op": 0,
    //           "data": "string"
    //         }
    //       ]
    //     }
    //   }



   
    useEffect(()=>{
        async function fetchData() {
            // You can await here
            await fetchAllDatas(filter).then((response) => {
                console.log("trigger",response.data)

                setCourses(response.data.result != [] ? response.data.result.data : [])
                // setCurrentPage(response.data.result.data)
                setPageCounter(response.data.result.paginationCounter)
            })
            // ...
          }
          fetchData();
     
          

    },[filter])


    const handleClickChangePageNumber = (clickedPageNumber) => {
  
        setFilter((prevFilter) => ({
            ...prevFilter,      
            pageIndex: clickedPageNumber 
        }));
    };

    if (courses.length <0 && pageCounter == 0) {
        
        return (
            <IsLoading></IsLoading>
        )
    }
    
    


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CourseSectionS3 courses={courses} component={"course"} />
            <div className="pagination-wrapper">
                        <ul className="pg-pagination">
                            {
                                filter.pageIndex != 1 ? (
                                    <li>
                                    <Button color='primary' aria-label="Previous" onClick={()=>handleClickChangePageNumber(filter.pageIndex-1)}>
                                        <i className="fi ti-angle-left"></i>
                                    </Button>
                                   </li>

                                ) : ("")
                            }
                          
                            {
                                [...Array(pageCounter)].map((_, index) => (
                                    <li key={index} className={index === 0 ? "active" : ""}>
                                        <li className="active"><Button color="primary" onClick={()=>handleClickChangePageNumber(index+1)} >{index + 1}</Button></li>
                                    </li>
                                ))
                              
                                //

                             
                            }
                            {
                                filter.pageIndex != pageCounter ? (
                                    <li>
                                    <Button color='primary' aria-label="Next" onClick={()=>handleClickChangePageNumber(filter.pageIndex+1)}>
                                        <i className="fi ti-angle-right"></i>
                                    </Button>
                                </li>
                                ) : ("")
                            }

                           
                        </ul>
                    </div>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePage;
