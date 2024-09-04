import React, { Fragment, useEffect, useState } from "react";
import video from "../../images/video/html.mp4";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetSectionSubDetailsQuery } from "../../api/sectionApi";
import { useGetWatchVideoUrlMutation } from "../../api/videoApi";
import VideoPage from "./VideoPage";
import IsLoading from "../../components/Loading/IsLoading";
import "./style/lessonPage.css";
import Comments from "../Comment/Comments";
import StarRating from "./StarRating";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const LessonPage = () => {
  const location = useLocation();
  const { from } = location.state || 0;
  const { sectionId } = useParams();
  const [expanded, setExpanded] = React.useState(false);
  const { data, isLoading } = useGetSectionSubDetailsQuery(sectionId);
  const [videos, setVideos] = useState([]);
  const [videoCounter, setVideoCounter] = useState(0);
  const [videoId, setVideoId] = useState();
  const [ownRating, setOwnRating] = useState();
  const [courseId, setCourseId] = useState();
  const [open, setOpen] = React.useState([]);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);

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
      setVideos(data.result.videos || []);
      setCourseId(data.result.courseId);
      if (videos == []) {
        localStorage.removeItem("willSelectedVideo");
      }
    }
  }, [data]);

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

  if (isLoading) {
    return <IsLoading></IsLoading>;
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeVideo = async (videoId) => {
    setVideoId(videoId);
    const videoUrl = videos.find((video) => video.videoId === videoId);
    if (videoUrl) {
      await decryptVideoUrl(videoUrl.publicVideoId)
        .then((response) => {
          localStorage.setItem(
            "willSelectedVideo",
            JSON.stringify(response.data.result)
          );
        })
        .catch((err) => console.error(err));
    } else {
      console.error("Video not found!");
    }
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor((duration % 1) * 100); // Extract milliseconds

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  };

  return (
    <Fragment>
      <section className="wpo-lesson-section container mx-auto sm:px-28 p-4 gap-3 flex flex-col ">
        <Breadcrumbs />
        <div className="flex flex-col  gap-6 md:flex-row">
          <div className="flex flex-col  flex-1 gap-3 order-2 md:!order-none ">
            <div className=" rounded-2xl shadow-lg font-bold p-3 text-themeOrange">
              React Native
            </div>
            <div className="p-2 rounded-2xl shadow-lg flex flex-col gap-0">
              {videos.map((video, index) => (
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
                      <span className="">{video.title}</span>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ml-2 flex items-center  ${
                          open.includes(index) ? "rotate-180" : ""
                        }`}
                        id={index}
                        open={open}
                      />
                    </span>
                  </AccordionHeader>
                  <AccordionBody className="text-base p-1 px-4">
                    <a
                      href={video.link}
                      onClick={() => changeVideo(video.videoId)}
                      className="  hover:underline none-underline cursor-pointer hover:text-themeOrange focus:text-themeOrange    "
                    >
                      {video.title}
                    </a>
                  </AccordionBody>
                </Accordion>
              ))}
            </div>

            <StarRating
              courseId={data.result.courseId}
              ownRating={ownRating}
            ></StarRating>

            <div className="rounded-2xl shadow-md bg-gray-200 order-3 md:!order-none md:hidden ">
              <Comments videoDetail={videoId} />
            </div>
          </div>

          <VideoPage videoId={videoId}></VideoPage>
        </div>
      </section>
    </Fragment>
  );
};
export default LessonPage;
