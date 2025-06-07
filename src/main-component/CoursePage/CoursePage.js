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

// Stil nesnelerini daha organize bir şekilde düzenleyelim
const styles = {
    buttonStyle: {
        padding: '10px 20px',
        width: '150px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        margin: '10px 0',
    },
    container: {
        padding: '20px 0',
        margin: '0 auto'
    },
    filterContainer: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '30px 0',
    },
    paginationButton: {
        margin: '0 5px',
    },
    noCoursesMessage: {
        textAlign: 'center',
        padding: '50px 0',
        fontSize: '1.5rem',
        color: '#666'
    }
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
    const [loading, setLoading] = useState(true);
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
        setLoading(true);

        async function fetchData() {    
            await fetchAllDatas(filter).then((response) => {

                setCourses(response.data.result != [] ? response.data.result.data : [])
                // setCurrentPage(response.data.result.data)
                setPageCounter(response.data.result.paginationCounter)
                if (localStorage.getItem("currentPageNumber")) {
                setTrick(parseInt(localStorage.getItem("currentPageNumber")))
                    
                }
                localStorage.removeItem("currentPageNumber")
                setLoading(false);
            }).catch(error => {
                console.error("Veri yüklenirken bir hata oluştu:", error);
                setLoading(false);
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


    if (loading) {
        return <IsLoading />
    }

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Kurslar'} pagesub={'Eğitimlerinizi keşfedin'} />
            
            <div className='container' style={styles.container}>
                <div style={styles.filterContainer}>
                    <div className='row w-100'>
                        <div className='col-md-8 mb-2'>
                            <Search onData={handleDataFromChild} onChangeClick={handleClickedEnter} />
                        </div>
                        <div className='col-md-4 text-right mb-2'>
                            <button
                                onClick={() => setOpenModal(!openModal)}
                                style={styles.buttonStyle}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#45a049';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4CAF50';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {openModal ? 'Filtreyi Kapat' : 'Filtrele'}
                            </button>
                        </div>
                    </div>
                    
                    {openModal && (
                        <div className='row w-100 mt-3'>
                            <div className='col-12'>
                                <MainPageFilter onData={handleDataFromChild} openModal={handleOpenModal} />
                            </div>
                        </div>
                    )}
                </div>
                
                {courses.length > 0 ? (
                    <>
                        <CourseSectionS3 courses={courses} paginationNumber={filter.pageIndex} component={"course"} />
                        
                        <div style={styles.paginationContainer} className="pagination-wrapper">
                            <ul className="pg-pagination d-flex align-items-center list-unstyled">
                                {filter.pageIndex !== 1 && (
                                    <li>
                                        <Button 
                                            color='primary' 
                                            style={styles.paginationButton}
                                            onClick={() => {
                                                handleClickChangePageNumber(filter.pageIndex - 1);
                                                setTrick();
                                            }}
                                        >
                                            <i className="fi ti-angle-left"></i>
                                        </Button>
                                    </li>
                                )}
                                
                                {[...Array(pageCounter)].map((_, index) => (
                                    <li key={index}>
                                        <Button 
                                            color={index === trick - 1 ? "primary" : "light"}
                                            style={styles.paginationButton} 
                                            onClick={() => {
                                                handleClickChangePageNumber(index + 1);
                                                setTrick(index + 1);
                                            }}
                                        >
                                            {index + 1}
                                        </Button>
                                    </li>
                                ))}
                                
                                {filter.pageIndex !== pageCounter && pageCounter > 0 && (
                                    <li>
                                        <Button 
                                            color='primary'
                                            style={styles.paginationButton}
                                            onClick={() => {
                                                handleClickChangePageNumber(filter.pageIndex + 1);
                                                setTrick();
                                            }}
                                        >
                                            <i className="fi ti-angle-right"></i>
                                        </Button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div style={styles.noCoursesMessage}>
                        <div className="alert alert-info">
                            <i className="fa fa-info-circle mr-2"></i>
                            Bu kategoride kurs bulunamadı. Lütfen farklı bir arama veya filtre deneyin.
                        </div>
                    </div>
                )}
            </div>
            
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePage;
