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
            setIsEnrolledCourse(response?.data);

        });
      } else {
        setIsEnrolledCourse(false);
      }
    }
    CheckActiveCourse();
  }, [CheckHasThisCourse, courseId]);

  
  if (isEnrolledCourse === null) {
    return null;
  }

  return (
    <>
      {
        isEnrolledCourse
          ? children
          : <Navigate to={`/course-single/${courseId}`} replace={true} /> 
      }
    </>
  );
};

export default PrivateEnrolledCourseRoute;
