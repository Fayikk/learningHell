import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DocumentIcon from "../../icons/DocumentIcon";

const CourseSingleAccardion = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };


  

  const [courseDetails, setCourseDetails] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // Hangi bölümün açık olduğunu tutan state

  useEffect(() => {
    if (props.courseDetail && props.courseDetail.sections) {
      setCourseDetails(props.courseDetail.sections);
    }
  }, [props]);

  // Toggle function to open/close the accordion
  const toggleSection = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)); // Aynı bölüme tıklanırsa kapatır, başka bölüme tıklanırsa açar
  };

  return (
    <div className="rounded-2xl shadow-lg p-5 flex flex-col flex-1 sm:gap-3">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-2xl">Konular</h1>

        <div className="flex flex-col">
          {courseDetails.map((courseDetail, index) => (
            <div key={index} className="relative mb-3">
              <h6 className="mb-0">
                <button
                  className="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
                  onClick={() => toggleSection(index)} // Toggle işlemi burada
                >
                  <span>{courseDetail.sectionName}</span>
                  <i
                    className={`absolute  right-0 pt-1 text-base transition-transform fa fa-chevron-down ${
                      activeIndex === index ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
              </h6>

              {/* Açık olan bölümü göstermek için `activeIndex` kontrolü yapıyoruz */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "h-auto" : "h-0"
                }`}
              >
                {courseDetail.videos.map((video, videoIndex) => (
                  <div
                    key={videoIndex}
                    className="p-6 text-sm flex flex-col leading-normal  text-blacck"
                  >
                    <div className="flex justify-between">
                      <Link
                        to={""}
                        className="hover:text-themeOrange hover:font-bold focus:text-themeOrange"
                      >
                        {video.title}
                      </Link>
                      <Link to={""}>
                        <DocumentIcon />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSingleAccardion;
