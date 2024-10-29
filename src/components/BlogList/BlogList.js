import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogSidebar from "../BlogSidebar/BlogSidebar.js";
import { useSelector } from "react-redux";
import { useIsCourseHaveStudentMutation } from "../../api/studentCourseApi.js";
import { Button } from "reactstrap";
import { calculateAverageRating } from "../../Helpers/calculateAverageRating";
import { useTranslation } from "react-i18next";
import './styles/BlogList.css'
const BlogList = (props) => {
  const { t } = useTranslation();
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
      rules: [{ field: "UserId", op: 1, data: "" }],
    },
  });

  useEffect(() => {
    const getMyCourses = async () => {
      try {
        await GetMyCourses(filter).then((response) => {
          setPageCounter(response.data.result.paginationCounter);
          setMyCourse(response.data.result.data);
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    getMyCourses();
  }, [filter]);

  const handleClickChangePageNumber = (clickedPageNumber) => {
    setFilter((prevFilter) => ({ ...prevFilter, pageIndex: clickedPageNumber }));
    window.scrollTo(0, 0);
  };

  return (
    <section className="blog-list-section">
      <div className={`blog-list-container ${props.pClass}`}>
        <div className="blog-list-content">
          <div className="course-grid">
            {myCourse &&
              myCourse.map((course, key) => (
                <Link
                  onClick={() => window.scrollTo(10, 0)}
                  to={`/course-single/${course.courseId}`}
                  key={key}
                  className="course-card"
                >
                  <div className="course-card-content">
                    <img src={course.courseImage} alt="" className="course-image" />
                    <div className="course-info">
                      <div className="course-header">
                        <img src={course.author} alt="" className="author-avatar" />
                        <span className="course-rating">
                          <i className="fi flaticon-star"></i> {calculateAverageRating(course.ratings)}
                        </span>
                      </div>
                      <h4 className="course-name">{course.courseName}</h4>
                      <div className="course-meta">
                        <span>
                          <i className="fi flaticon-reading-book"></i> {course.student} {t("Students")}
                        </span>
                        <span>
                          <i className="fi flaticon-agenda"></i> {course.lesson} {t("Lesson")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className="pagination-wrapper">
            <Button
              color="primary"
              disabled={filter.pageIndex === 1}
              onClick={() => handleClickChangePageNumber(filter.pageIndex - 1)}
            >
              <i className="fi ti-angle-left"></i>
            </Button>
            {[...Array(pageCounter)].map((_, index) => (
              <Button
                key={index}
                color="primary"
                className={filter.pageIndex === index + 1 ? "active" : ""}
                onClick={() => handleClickChangePageNumber(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              color="primary"
              disabled={filter.pageIndex === pageCounter}
              onClick={() => handleClickChangePageNumber(filter.pageIndex + 1)}
            >
              <i className="fi ti-angle-right"></i>
            </Button>
          </div>
        </div>
        <BlogSidebar blLeft={props.blLeft} />
      </div>
    </section>
  );
};

export default BlogList;
