import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BlogSidebar from "../BlogSidebar/BlogSidebar.js";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useIsCourseHaveStudentMutation } from "../../api/studentCourseApi.js";
import { Button } from "reactstrap";
import { calculateAverageRating } from "../../Helpers/calculateAverageRating";
import { useTranslation } from "react-i18next";
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
          console.log("get my courses", response), setMyCourse(response.data.result.data);
          setPageCounter(response.data.result.paginationCounter);
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
            <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
              {myCourse &&
                myCourse.map((course, key) => (
                  <Link onClick={ClickHandler} to={`/course-single/${course.courseId}`} key={key} style={{ flex: "0 0 33.333333%", maxWidth: "33.333333%" }}>
                    <div className="wpo-popular-single">
                      <div className="wpo-popular-item">
                        <div className="wpo-popular-img">
                          <img src={course.courseImage} alt="" />
                          {/* <div className="thumb">
                                                    <span>${course.coursePrice}</span>
                                                </div> */}
                        </div>
                        <div className="wpo-popular-content">
                          <div className="wpo-popular-text-top">
                            <ul>
                              <li>
                                <img src={course.author} alt="" />
                              </li>
                              {/* <li><Link onClick={ClickHandler} to={`/team-single/${course.courseId }`}>{course.user.normalizedUserName}</Link></li> */}
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
            {/* <div className="pagination-wrapper pagination-wrapper-left">
                            <ul className="pg-pagination">
                                <li>
                                    <Link to="/blog-left-sidebar" aria-label="Previous">
                                        <i className="fi ti-angle-left"></i>
                                    </Link>
                                </li>
                                <li className="active"><Link to="/blog-left-sidebar">1</Link></li>
                                <li><Link to="/blog-left-sidebar">2</Link></li>
                                <li><Link to="/blog-left-sidebar">3</Link></li>
                                <li>
                                    <Link to="/blog-left-sidebar" aria-label="Next">
                                        <i className="fi ti-angle-right"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div> */}
          </div>
          <BlogSidebar blLeft={props.blLeft} />
          <div className="pagination-wrapper">
            <ul className="pg-pagination">
              {filter.pageIndex != 1 ? (
                <li>
                  <Button color="primary" aria-label="Previous" onClick={() => handleClickChangePageNumber(filter.pageIndex - 1)}>
                    <i className="fi ti-angle-left"></i>
                  </Button>
                </li>
              ) : (
                ""
              )}

              {
                [...Array(pageCounter)].map((_, index) => (
                  <li key={index} className={index === 0 ? "active" : ""}>
                    <li className="active">
                      <Button color="primary" onClick={() => handleClickChangePageNumber(index + 1)}>
                        {index + 1}
                      </Button>
                    </li>
                  </li>
                ))

                //
              }
              {filter.pageIndex != pageCounter ? (
                <li>
                  <Button color="primary" aria-label="Next" onClick={() => handleClickChangePageNumber(filter.pageIndex + 1)}>
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
    </section>
  );
};

export default BlogList;
