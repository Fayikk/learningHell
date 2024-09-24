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
import Search from '../../components/Search/Search';
const CoursePage = () => {

    const {slug} = useParams();
 
    // const {data,isLoading} = useGetCoursesByCategoryIdQuery(slug);
    const [fetchAllDatas] = useGetAllCoursesMutation();
    const [courses,setCourses] = useState([])
    const [trick,setTrick] = useState(1);
    const [pageCounter,setPageCounter] = useState(0);
    const [query,setQuery] = useState("");
    const [isClickedEnter,setIsClickedEnter] = useState(false)
    const [newRule,setNewRule] = useState({
        field:"CourseName",
        op:3,
        data:""
    })
    const [filter,setFilter] = useState({
        isSearch:true,
        pageIndex:localStorage.getItem("currentPageNumber") && localStorage.getItem("currentPageNumber") !== "undefined" ? parseInt(localStorage.getItem("currentPageNumber")) : 1,
        pageSize:6,
        sortColumn:"CourseName",
        sortOrder:"desc",
        filters:{
            groupOp:"AND",
            rules:[
                {
                    field:"CourseEvaluteStatus",
                    op:1,
                    data:"4"
                },
                {
                    field:"CategoryId",
                    op:1,
                    data:slug.toString()
                }
            ]
        }        
    })



    const [initalState] = useState({
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
                    data:"4"
                },
                {
                    field:"CategoryId",
                    op:1,
                    data:slug.toString()
                }
            ]
        }        
    })


    const addFilterRule = (newRule) => 
    {
        setFilter(prevFilter => ({
            ...prevFilter,
            filters:{
                ...prevFilter.filters,
                rules:[
                    ...prevFilter.filters.rules,
                    newRule
                ]
                    
                
            }
        }))
    }



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


    // useEffect(()=>{
    //     var currentlyPageNumber = localStorage.getItem("currentPageNumber")
    //     if (currentlyPageNumber) {
    //       setFilter((prevState) => ({
    //         ...prevState,pageIndex:currentlyPageNumber
    //       }))
    //     }
    // },[])



   
    useEffect(()=>{
        async function fetchData() {    
            await fetchAllDatas(filter).then((response) => {

                setCourses(response.data.result != [] ? response.data.result.data : [])
                // setCurrentPage(response.data.result.data)
                setPageCounter(response.data.result.paginationCounter)
                if (localStorage.getItem("currentPageNumber")) {
                setTrick(parseInt(localStorage.getItem("currentPageNumber")))
                    
                }
                localStorage.removeItem("currentPageNumber")
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

    const handleDataFromChild = (data) => {
        setQuery(data)

        setNewRule(prevRule => ({
            ...prevRule,
            data:data
        }))
    }


    const handleClickedEnter = (isClicked) => {
        setFilter(initalState)
        if (event.key == "Enter") {
        addFilterRule(newRule)

         setIsClickedEnter(isClicked)

        }
    }


    if (courses.length <0 && pageCounter == 0) {
        
        return (
            <IsLoading></IsLoading>
        )
    }
    

    const triggerMethod = (test) => {
console.log("trigger test method",test)
    }
    


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            {
                courses.length>0 ? (
             <Search onData={handleDataFromChild} onChangeClick={handleClickedEnter} ></Search>

                ) : ("")
            }

            <CourseSectionS3 courses={courses} paginationNumber={filter.pageIndex} component={"course"} />
            <div className="pagination-wrapper">
                        <ul className="pg-pagination">
                            {
                                filter.pageIndex != 1 ? (
                                    <li>
                                    <Button color='primary' aria-label="Previous" onClick={()=>{
                                        handleClickChangePageNumber(filter.pageIndex-1),
                                        setTrick()
                                    }}>
                                        <i className="fi ti-angle-left"></i>
                                    </Button>
                                   </li>

                                ) : ("")
                            }
                          
                            {
                                [...Array(pageCounter)].map((_, index) => (
                                    <li key={index} className={index === 0 ? "active" : ""}>
                                        <li className="active"><Button color={index === trick-1 ? "primary" : "warning"} onClick={()=>{
                                                                                                handleClickChangePageNumber(index+1),
                                                                                                setTrick(index+1)}} >{index + 1}</Button></li>
                                    </li>
                                ))
                            }
                            {
                                filter.pageIndex != pageCounter ? (
                                    <li>
                                    <Button color='primary' aria-label="Next" onClick={()=>{handleClickChangePageNumber(filter.pageIndex+1),setTrick()}}>
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
