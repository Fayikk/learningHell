import React, { createContext, Fragment, useContext, useEffect, useRef, useState } from "react";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetWatchVideoUrlMutation } from "../../api/videoApi";
// import { useGetEnrolledCourseIdQuery } from "../../api/courseApi";
import { useGetEnrolledCourseIdQuery } from "../../api/courseApi";
import VideoPage from "./VideoPage";
import IsLoading from "../../components/Loading/IsLoading";
import "./style/lessonPage.css";
import Comments from "../Comment/Comments";
import StarRating from "./StarRating";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDownloadMaterialFileMutation } from "../../api/materialApi";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import DocumentIcon from "../../icons/DocumentIcon";



const RefContext = createContext();


const LessonPage = () => {
  const sharedRef = useRef();
  const location = useLocation();
  const { from } = location.state || 0;
  const { courseId } = useParams();
  const [expanded, setExpanded] = React.useState(false);
  const { data, isLoading } = useGetEnrolledCourseIdQuery(courseId);

  // const { data, isLoading } = useGetSectionSubDetailsQuery(sectionId);
  const [videos, setVideos] = useState([]);
  const [courseInsideDetail,setCourseInsideDetail] = useState([]);
  const [videoCounter, setVideoCounter] = useState(0);
  const [videoId, setVideoId] = useState();
  const [ownRating, setOwnRating] = useState();
  // const [courseId, setCourseId] = useState();
  const [open, setOpen] = React.useState([]);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);
  const { slug } = useParams();
  const [downloadFile] = useDownloadMaterialFileMutation();
  const handleOpen = (index) => {
    setOpen((prevOpen) => {
      if (prevOpen.includes(index)) {
        return prevOpen.filter((item) => item !== index);
      } else {
        return [...prevOpen, index];
      }
    });
  };

  const [decryptVideoUrl] = useGetWatchVideoUrlMutation();
  useEffect(() => {
    if (data) {
      setCourseInsideDetail(data.result.item1.sections);
        localStorage.removeItem("willSelectedVideo");
     
    }
  }, [data]);


  useEffect(()=>{
    if (courseInsideDetail && courseInsideDetail[0]) {
      changeVideo(courseInsideDetail[0].videos[0].publicVideoId,courseInsideDetail[0].videos[0].videoId)
    }
  },[courseInsideDetail])

 
  const clickDownloadFile = async (fileUrl) => {
    var materialModel = {
      fileUrl: fileUrl,
      type: 1,
    };

    await downloadFile(materialModel).then((response) => {
      if (response.data.isSuccess) {
        const fileName = fileUrl; 
    const fileExtension = fileName.split('.').pop(); 
    let mimeType = '';

    switch (fileExtension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        mimeType = 'application/octet-stream'; 
        break;
    }

        const linkSource = `data:${mimeType};base64,${response.data.result}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        toast.success("Download process is success completed")
      }
    });
  };





  useEffect(() => {
    if (from != 0) {
      setOwnRating(from);
    }
  }, [from]);

  useEffect(() => {
    if (videos.length > 0) {
      changeVideo(videos[0].videoId || "");
    }
  }, [videos]);


  const changeVideo = async (publicVideoId,videoId) => {
    setVideoId(videoId);
    // const videoUrl = videos.find((video) => video.videoId === videoId);
      await decryptVideoUrl(publicVideoId)
        .then((response) => {
          if (sharedRef.current) {
          sharedRef.current.src = response.data.result
          sharedRef.current.play()

            
          }

    
        })
        .catch((err) => console.error(err));
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor((duration % 1) * 100); // Extract milliseconds

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  };
  if (isLoading) {
    return <IsLoading></IsLoading>;
  }
  return (
    <Fragment>
      <section className="wpo-lesson-section container mx-auto p-4 gap-3 flex flex-col ">
        {/* <PageTitle
          pageTitle={data.result.item1.courseName}
          pagesub={"Course"}
        /> */}
        <Breadcrumbs
          steps={[
            {
              title: data?.result?.item1?.courseName,
              to: `/course-single/${data?.result?.item1?.courseId}`,
            },
            {
              title: "lessons",
              to: `/lessons/${data?.result?.item1?.courseId}`,
            },
          ]}
        />
        <div className="flex flex-col  gap-6 md:flex-row">
          <div className="flex flex-col  flex-1 gap-3 order-2 md:!order-none ">
            {/* <div className=" rounded-2xl shadow-lg font-bold p-3 text-themeOrange">
              {data?.result?.sectionName}
            </div> */}
            <div className="p-2 rounded-2xl shadow-lg flex flex-col gap-0">
              
{
  courseInsideDetail.map((section,index) => (
                <Accordion
                  key={index}
                  className="flex flex-col gap-2"
                  open={open.includes(index)}
                >

    <AccordionHeader
    className="text-base text-gray-600 font-bold px-3 -my-1 flex items-center justify-between"
    onClick={() => handleOpen(index)}
  >
    <span className="flex items-center">
      <span className="">{section.sectionName}</span>
      <ChevronDownIcon
        className={`h-5 w-5 transition-transform ml-2 flex items-center  ${
          open.includes(index) ? "rotate-180" : ""
        }`}
        id={index}
        open={open}
      />
    </span>
  </AccordionHeader>
  {
    section.videos.map((video,key) => (
      <AccordionBody className="text-base p-1 px-4">
        <Row>
          <Col>
          <a
        href={video.link}
        onClick={() => changeVideo(video.publicVideoId,video.videoId)}
        className="  hover:underline none-underline cursor-pointer hover:text-themeOrange focus:text-themeOrange    "
      >
        {video.title}
      </a></Col>
      <Col>
      {
        video.materials.length>0 ? (
          <Link onClick={()=>clickDownloadFile(video.materials[key].fileUrl)} to={""}>
      
          <DocumentIcon  ></DocumentIcon>
          </Link>
        ) : ("")
      }
    
      </Col>
     
    
      </Row>
    </AccordionBody>
    ))
  }</Accordion>
                ))  }
            </div>

            <StarRating
              courseId={courseId}
              ownRating={ownRating}
            ></StarRating>

            <div className="rounded-2xl shadow-md bg-gray-200 order-3 md:!order-none md:hidden ">
              <Comments videoDetail={videoId} />
            </div>
          </div>
<RefContext.Provider value={sharedRef} >
<VideoPage videoId={videoId} videoRef={sharedRef} ></VideoPage>

</RefContext.Provider>
        </div>
      </section>
    </Fragment>
  );
};
export default LessonPage;
