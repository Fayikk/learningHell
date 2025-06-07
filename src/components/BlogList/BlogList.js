import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BlogSidebar from "../BlogSidebar/BlogSidebar.js";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useIsCourseHaveStudentMutation } from "../../api/studentCourseApi.js";
import { Button } from "reactstrap";
import { calculateAverageRating } from "../../Helpers/calculateAverageRating";
import { useTranslation } from "react-i18next";
import './Styles/BlogList.css'
const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const BlogList = (props) => {
  const { t } = useTranslation();
  const { i18 } = useTranslation();
  const [pageCounter, setPageCounter] = useState(0);

  const [GetMyCourses] = useIsCourseHaveStudentMutation();
  const [myCourse, setMyCourse] = useState();
  const [filter, setFilter] = useState({
    isSearch: true,
    pageIndex: 1,
    pageSize: 6,
    sortColumn: "CreatedDate",
    sortOrder: "desc",
    filters: {
      groupOp: "AND",
      rules: [
        {
          field: "UserId",
          op: 1,
          data: "",
        },
      ],
    },
  });

  useEffect(() => {
    const getMyCourses = async () => {
      try {
        await GetMyCourses(filter).then((response) => {
          setPageCounter(response.data.result.paginationCounter);
          setMyCourse(response.data.result.data)
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    getMyCourses();
  }, [filter]);

  const handleClickChangePageNumber = (clickedPageNumber) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      pageIndex: clickedPageNumber,
    }));
  };

  return (
    
    <section className="wpo-blog-pg-section section-padding">
    <div className={`wpo-popular-area section-padding ${props.pClass}`}>
      <div className="container">
        <div className="wpo-popular-wrap">
          <div className="row align-items-center" style={{ display: "flex", flexWrap: "wrap" }}>
            {myCourse &&
              myCourse.map((course, key) => (
                <Link
                  onClick={ClickHandler}
                  to={`/course-single/${course.courseId}`}
                  key={key}
                  className="course-card"
                >
                  <div className="wpo-popular-single">
                    <div className="wpo-popular-item">
                      <div className="wpo-popular-img">
                        <img style={{ height: "200px" }} src={course.courseImage} alt="" />
                      </div>
                      <div className="wpo-popular-content">
                        <div className="wpo-popular-text-top">
                          <ul>
                            <li>
                              <img src={course.author} alt="" />
                            </li>
                          </ul>
                          <ul>
                            <li>
                              <i className="fi flaticon-star"></i>
                            </li>
                            <li>({calculateAverageRating(course.ratings)})</li>
                          </ul>
                        </div>
                        {course.courseName}
                        <div className="wpo-popular-text-bottom">
                          <ul>
                            <li>
                              <i className="fi flaticon-reading-book"></i> {course.student} {t("Students")}
                            </li>
                            <li>
                              <i className="fi flaticon-agenda"></i> {course.lesson} {t("Lesson")}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <BlogSidebar blLeft={props.blLeft} />
          <div className="pagination-wrapper">
            <ul className="pg-pagination">
              {filter.pageIndex != 1 ? (
                <li>
                  <Button
                    color="primary"
                    aria-label="Previous"
                    onClick={() => {
                      handleClickChangePageNumber(filter.pageIndex - 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <i className="fi ti-angle-left"></i>
                  </Button>
                </li>
              ) : (
                ""
              )}
              {[...Array(pageCounter)].map((_, index) => (
                <li key={index} className={index === 0 ? "active" : ""}>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleClickChangePageNumber(index + 1);
                      window.scrollTo(15, 15);
                    }}
                  >
                    {index + 1}
                  </Button>
                </li>
              ))}
              {filter.pageIndex != pageCounter ? (
                <li>
                  <Button
                    color="primary"
                    aria-label="Next"
                    onClick={() => {
                      handleClickChangePageNumber(filter.pageIndex + 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <i className="fi ti-angle-right"></i>
                  </Button>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  
  );
};

export default BlogList;
