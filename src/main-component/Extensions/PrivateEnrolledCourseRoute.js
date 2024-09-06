import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useThisCourseEnrolledUserMutation } from '../../api/studentCourseApi';
import {jwtDecode} from 'jwt-decode'; // No need to destructure

const PrivateEnrolledCourseRoute = ({ children }) => {
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(null); // Changed the initial value to null to avoid unnecessary rendering
  const [CheckHasThisCourse] = useThisCourseEnrolledUserMutation();

  useEffect(() => {
    async function CheckActiveCourse() {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode(token);
        const model = {
          userId: decode.nameid,
          courseId: courseId,
        };
        await CheckHasThisCourse(model).then((response) => {
            setIsEnrolledCourse(response?.data); // Assuming 'isSuccess' indicates course enrollment

        });
      } else {
        setIsEnrolledCourse(false); // In case the token is missing, treat as not enrolled
      }
    }
    CheckActiveCourse();
  }, [CheckHasThisCourse, courseId]);

  // Handle cases before the state is determined (e.g., when `isEnrolledCourse` is null)
  if (isEnrolledCourse === null) {
    return null; // Render nothing (or a loading spinner) while checking enrollment status
  }

  return (
    <>
      {
        isEnrolledCourse
          ? children // If enrolled, render the child components (e.g., course content)
          : <Navigate to={`/course-single/${courseId}`} replace={true} /> // Redirect to course page if not enrolled
      }
    </>
  );
};

export default PrivateEnrolledCourseRoute;
