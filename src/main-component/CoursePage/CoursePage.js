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
import MainPageFilter from '../../components/Filters/MainPageFilter';
import { Languages } from '../Extensions/Languages';

const butonStyle = {
    padding: '10px 20px',        // Daha az iç boşluk
    width: '150px',              // Buton genişliği
    backgroundColor: '#4CAF50',  // Arka plan rengi
    color: '#fff',               // Metin rengi
    border: 'none',              // Kenar çizgisi
    borderRadius: '8px',         // Yuvarlatılmış kenarlar
    cursor: 'pointer',           // Fare imleci
    fontSize: '16px',            // Metin boyutu
    fontWeight: 'bold',          // Kalın metin
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Gölge efekti
  }


const CoursePage = () => {

    const {slug} = useParams();
 
    // const {data,isLoading} = useGetCoursesByCategoryIdQuery(slug);
    const [fetchAllDatas] = useGetAllCoursesMutation();
    const [courses,setCourses] = useState([])
    const [trick,setTrick] = useState(1);
    const [pageCounter,setPageCounter] = useState(0);
    const [query,setQuery] = useState("");
    const [openModal,setOpenModal] = useState(false);
    const [advanceFilter,setAdvanceFilter]= useState();
    const [isClickedEnter,setIsClickedEnter] = useState(false)
    const [newRule,setNewRule] = useState({
        field:"CourseName",
        op:3,
        data:""
    })

    const [advanceNewRule,setAdvanceNewRule]=useState([])
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

    function count(obj) {

        if (obj.__count__ !== undefined) { 
            return obj.__count__;
        }
    
        if (Object.keys) { 
            return Object.keys(obj).length;
        }
    
    
        var c = 0, p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                c += 1;
            }
        }
    
        return c;
    
    }


    const handleOpenModal = (value) => {
        setOpenModal(value)
    }




    const handleDataFromChild = (data) => {

        if (data.type=="filter") {
            setFilter(initalState)
    
            setAdvanceNewRule([]);
            if (typeof(data) == "object") {
                setAdvanceFilter(data);
            
            
                let newRules = []; 
            
                for (let key in data) {
                    if (data.hasOwnProperty(key) && key !== "rating"&& key !== "type" && data[key] !== "") {
                        
                        let newRule = {
                            field: key === "lowPriceRange" || key === "highPriceRange" ? "CoursePrice" : key,
                            op: 1,
                            data: data[key]
                        };
        
                        if (key === "CourseLanguage") {
                            newRule.op = 1;
                        } else if (key === "lowPriceRange") {
                            newRule.op = 6;
                        } else if (key === "highPriceRange") {
                            newRule.op = 7;
                        } else if (key === "rating") {
                            newRule.op = 6;
                        }
        
                        newRules.push(newRule); 
                    }
                }
            
                newRules.forEach(rule => {
                    setAdvanceNewRule(prevRule => [...prevRule, rule]);
                    addFilterRule(rule);
                });
            } else {
                setQuery(data);
                setNewRule(prevRule => ({
                    ...prevRule,
                    data: data
                }));
            }
        
        }
        else{
            setFilter(initalState)

        }

      
    };
    


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
    




    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            {
                courses.length>0 ? (
                    <>
                    <div className='container' >
                        <div className='row' >
                        <Search onData={handleDataFromChild} onChangeClick={handleClickedEnter} ></Search>
                        <button
  onClick={() => setOpenModal(!openModal)}
  style={butonStyle}
  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
>
  Filter
</button>

                        </div>
                        {
                            openModal ? (
                                <div className='row' >
                                <MainPageFilter onData={handleDataFromChild} openModal={handleOpenModal} ></MainPageFilter>
        
                                </div>
                            ) : ""
                        }
                      
                    </div>
             </>
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
