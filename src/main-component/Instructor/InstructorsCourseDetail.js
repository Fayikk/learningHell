import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Accordion from "react-bootstrap/Accordion";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import Footer from "../../components/footer/Footer";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { useParams } from "react-router-dom";
import IsLoading from "../../components/Loading/IsLoading";
import {
  instructorApi,
  useGetCourseDetailQuery,
} from "../../api/instructorApi";
import {
  useDownloadMaterialFileMutation,
  useRemoveMaterialAsyncMutation,
  useUploadMaterialFileMutation,
} from "../../api/materialApi";
import JSZip from "jszip";
import {
  useAddVideoAsyncMutation,
  useChangeVideoAsncMutation,
  useGetWatchVideoUrlMutation,
  useRemoveVideoAsyncMutation,
  useUpdateVideoAsyncMutation,
} from "../../api/videoApi";
import VideoPage from "../LessonPage/VideoPage";
import { CiCircleRemove } from "react-icons/ci";
import {
  useAddSectionAsyncMutation,
  useRemoveSectionAsyncMutation,
  useUpdateSectionAsyncMutation,
  useUpdateSectionRowsMutation,
} from "../../api/sectionApi";
import { useDispatch } from "react-redux";
import CustomModal from "../CustomComponents/CustomModal";
import InstructorAuth from "../../Wrappers/HoC/InstructorAuth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "reactstrap";
import { toast } from "react-toastify";
import { IoPencil } from "react-icons/io5";
import Spinner from "react-bootstrap/Spinner";
import { useEvaluateUpdateCourseMutation } from "../../api/courseApi";
import { courseEvaluateEnum } from "../../api/Enums/evaluateEnum";
import { useSelector } from "react-redux";
import EvaluateModal from "../CustomComponents/EvaluateModal";
import Roles from "../../Constants/Roles";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function InstructorsCourseDetail() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const { slug } = useParams();
  const { data, isLoading } = useGetCourseDetailQuery(slug);
  const [downloadFile] = useDownloadMaterialFileMutation();
  const userId = useSelector((state) => state.authStore.nameIdentifier);
  const [watchingVideo] = useGetWatchVideoUrlMutation();
  const [removeVideoAsync] = useRemoveVideoAsyncMutation();
  const [removeSectionAsync] = useRemoveSectionAsyncMutation();
  const [changeVideoAsync] = useChangeVideoAsncMutation();
  const [addVideoAsync] = useAddVideoAsyncMutation();
  const [updateSectionAsync] = useUpdateSectionAsyncMutation();
  const [uploadMaterialAsync] = useUploadMaterialFileMutation();
  const [removeMaterialAsync] = useRemoveMaterialAsyncMutation();
  const [updateVideoAsync] = useUpdateVideoAsyncMutation();
  const [updateEvaluate] = useEvaluateUpdateCourseMutation();
  const [updateSectionRows] = useUpdateSectionRowsMutation();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [chooseVideo, setChooseVideo] = useState(false);
  const [sections, setSections] = useState([]);
  const [modal, isShowModal] = useState(false);
  const [evaluateModal, setEvaluateModal] = useState(false);
  const [createSectionAsync] = useAddSectionAsyncMutation();
  const [isEnable, setIsEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [handleClickedUpdateRows, setHandleClickedUpdateRows] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [rowNumber, setRowNumber] = useState();
  const [isContinueProocess, setIsContinueProcess] = useState(false);
  const [videoDetail, setVideoDetail] = useState({
    publicVideoId: "",
    sectionId: "",
  });
  const [sectionModel, setSectionModel] = useState({
    sectionName: "",
    description: "",
    courseId: slug,
  });
  const [userRole, setUserRole] = useState([]);

  const [evaluateModel, setEvaluateModel] = useState({
    courseId: slug,
    courseEvaluateStatus: Number,
    courseEvaluateDescription: String,
  });
  const [videoId, setVideoId] = useState(
    buttonRef.current ? buttonRef.current.dataset.value : ""
  );

  useEffect(() => {
    if (data && data.result[0] && data.result[0].sections) {
      localStorage.setItem("sections", JSON.stringify(data.result[0].sections));
      setSections(data.result[0].sections);
    }
  }, [data]);

  if (isLoading) {
    return <IsLoading />;
  }

  const handleClickWatchingVideo = async (publicVideoId) => {
    await watchingVideo(publicVideoId).then((response) => {
      localStorage.setItem(
        "willSelectedVideo",
        JSON.stringify(response.data.result)
      );
      setChooseVideo(true);
    });
  };

  const closeVideo = () => {
    setChooseVideo(false);
  };

  const removeItem = async (itemId, itemName) => {
    var answer = window.confirm("Are you sure want to delete?");

    if (itemName === "video") {
      if (answer) {
        await removeVideoAsync(itemId).then((response) => {});
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
      }
    } else if (itemName === "section") {
      await removeSectionAsync(itemId).then((response) => {});
      dispatch(instructorApi.util.invalidateTags(["instructor"]));
    }
  };
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const newSections = Array.from(sections);
    const [movedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, movedSection);

    setSections(newSections);
    localStorage.setItem("sections", JSON.stringify(newSections));

    var storeSections = localStorage.getItem("sections");
    var sectionDataList = [];
    for (let index = 0; index < JSON.parse(storeSections).length; index++) {
      const element = JSON.parse(storeSections)[index];
      element.sequenceNumber = index;
      sectionDataList.push(element);
    }

    await updateSectionRows(sectionDataList).then((response) => {
      sectionDataList = [];
    });
  };

  const handleClickEdit = (sectionId) => {
    setEditingSectionId(editingSectionId === sectionId ? null : sectionId);
  };

  const handleOpenCustomModal = (title) => {
    isShowModal(!modal);
    setTitle(title);
  };

  const clickDownloadFile = async (fileUrl) => {
    var materialModel = {
      fileUrl: fileUrl,
      type: 1,
    };

    await downloadFile(materialModel).then((response) => {
      if (response.data.isSuccess) {
        const zip = new JSZip();
        zip.file("file.pdf", response.data.result);

        zip.generateAsync({ type: "blob" }).then(function (zipBlob) {
          const url = window.URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "download.zip";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const handleFromChildData = async (event) => {
    isShowModal(false);
    setIsContinueProcess(true);
    const formData = new FormData();
    const typeFile = event.file.target.files[0].type.split("/");
    if (
      (title == "ChangeVideo" || title == "NewVideo") &&
      typeFile[1] !== "mp4"
    ) {
      return alert("Please just mp4 format");
    }

    if (title == "ChangeVideo" || title == "NewVideo") {
      formData.append("File", event.file.target.files[0]);
      formData.append("Title", event.title);
      formData.append("RowNumberForSection", event.rowNumber);
      formData.append("SectionId", videoDetail.sectionId);
    }

    if (title == "NewMaterial") {
      formData.append("Name", event.title);
      formData.append("FileUrl", "");
      formData.append("VideoId", videoId);
      formData.append("File", event.file.target.files[0]);
    }

    const fileName = videoDetail.publicVideoId;

    if (title == "ChangeVideo") {
      await changeVideoAsync({ fileName, formData }).then((response) => {
        setLoading(true);

        if (response.data.isSuccess) {
          toast.success("Change Video Succeded");
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          setLoading(false);
          isShowModal(false);
          setIsContinueProcess(false);
        } else {
          setLoading(false);
          setIsContinueProcess(false);
        }
      });
    } else if (title == "NewMaterial") {
      await uploadMaterialAsync(formData).then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.messages[0]);
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          isShowModal(false);
          setIsContinueProcess(false);
        }
      });
    } else {
      await addVideoAsync(formData).then((response) => {
        if (response.data.isSuccess) {
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          isShowModal(false);
          toast.success(response.data.messages[0]);
          setLoading(false);
          setIsContinueProcess(false);
        } else {
          setLoading(false);
          setIsContinueProcess(false);
        }
      });
    }
  };

  const handleAuthForRoles = async (event) => {
    setUserRole(event.role);
  };

  const createSection = async () => {
    await createSectionAsync(sectionModel).then((response) => {
      if (response.data.isSuccess) {
        handleClose();
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        toast.success("Section created succeded");
      }
    });
  };

  const handleUpdateSection = async (sectionId) => {
    const sectionUpdateModel = {
      sectionName: sectionModel.sectionName,
      description: sectionModel.description,
    };

    var selectedSection = sections.filter((x) => x.sectionId == sectionId);


    await updateSectionAsync({ sectionId, sectionUpdateModel }).then(
      (response) => {
        if (response.data.isSuccess) {
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          toast.success("Section updated");
          setIsEnable(!isEnable);
          setEditingSectionId(null);
          setSectionModel({
            sectionName: "",
            description: "",
            courseId: slug,
          });
        }
      }
    );
  };

  const handleRemoveFile = async (fileName) => {
    var answer = window.confirm("Are you sure want to delete?");

    if (answer) {
      await removeMaterialAsync(fileName).then((response) => {
        if (response.data.isSuccess) {
          toast.success("removed material");
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
        }
      });
    }
  };

  const handleSendEvaluate = async (model) => {
    if (model.returnEvaluate === undefined) {
      if (data.result[0].userId === userId) {
        //here is in the send to for evaluate instructor
        //this reason enums value is =

        dispatch(instructorApi.util.invalidateTags(["course"]));
        // setEvaluateModel({
        //   courseId:slug,
        //   courseEvaluateStatus:courseEvaluateEnum.InEvaluation,
        //   courseEvaluateDescription:"Send To Evaluate"
        // })

        const evaluationModel = {
          courseId: slug,
          CourseEvaluteStatus: courseEvaluateEnum.InEvaluation,
          courseEvaluateDescription: "Send To Evaluate",
        };

        await updateEvaluate(evaluationModel).then((response) => {
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
        });
      }
    } else {
      const evaluationModel = {
        courseId: slug,
        CourseEvaluteStatus: model.returnEvaluate.statu,
        courseEvaluateDescription: model.returnEvaluate.description,
      };

      await updateEvaluate(evaluationModel).then((response) => {
        if (response.data.isSuccess) {
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          setEvaluateModal(false);
        } else {
          toast.error("Ooops!sometihng went wrong");
        }
      });
    }
  };

  const handleClickedVideo = (videoId) => {
    if (handleClickedUpdateRows === false) {
      setSelectedVideoId(videoId);
      setHandleClickedUpdateRows(!handleClickedUpdateRows);
    } else {
      setSelectedVideoId(null);
      setHandleClickedUpdateRows(!handleClickedUpdateRows);
    }
  };

  const handleUpdateVideo = async (videoId) => {
    const updateVideoModel = {
      rowNumberForSection: rowNumber,
    };


    await updateVideoAsync({ videoId, updateVideoModel }).then((response) => {
      if (response.data.isSuccess) {
        toast.success("Video Updated Successfully");
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        setHandleClickedUpdateRows(false);
      } else {
        toast.error(response.data.messages[0]);
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
      }
    });
  };

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: `calc(100% - ${grid * 2}px)`, // padding'i hesaba katıyoruz
    boxSizing: "border-box",
  });

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightblue" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const renderButton = () => {
    if (
      data.result[0].userId === userId &&
      data.result[0].courseEvaluteStatus === courseEvaluateEnum.Pending
    ) {
      return (
        <Button className="btn btn-danger" onClick={handleSendEvaluate}>
          Send Evaluate
        </Button>
      );
    }
    if (
      data.result[0].userId === userId &&
      data.result[0].courseEvaluteStatus === courseEvaluateEnum.InRevision
    ) {
      return (
        <>
          <Button className="btn btn-danger" onClick={handleSendEvaluate}>
            ReSend Evaluate
          </Button>
          <Button
            className="btn btn-warning"
            onClick={() => setEvaluateModal(!evaluateModal)}
          >
            Read The Description
          </Button>
        </>
      );
    } else if (
      userRole.includes(Roles.SuperVisor) &&
      data.result[0].courseEvaluteStatus === courseEvaluateEnum.InEvaluation
    ) {
      return (
        <Button
          className="btn btn-success"
          onClick={() => setEvaluateModal(!evaluateModal)}
        >
          Evaluate
        </Button>
      );
    } else if (
      data.result[0].courseEvaluteStatus === courseEvaluateEnum.Accept ||
      ((userRole.includes(Roles.SuperVisor) ||
        data.result[0].userId !== userId) &&
        data.result[0].courseEvaluteStatus === courseEvaluateEnum.Accept)
    ) {
      return (
        <Button className="btn btn-success" disabled>
          {t("Course Is Published")}
        </Button>
      );
    } else if (
      data.result[0].courseEvaluteStatus === courseEvaluateEnum.Cancel
    ) {
      return (
        <>
          <Button className="btn btn-danger" disabled>
            {t("Course is rejected")}
          </Button>
          <Button
            className="btn btn-warning"
            onClick={() => setEvaluateModal(!evaluateModal)}
          >
            Read The Description
          </Button>
        </>
      );
    } else {
      return (
        <Button className="btn btn-warning" disabled>
          Sended to evaluate
        </Button>
      );
    }
  };

  if (isContinueProocess) {
    return isContinueProocess ? (
      <div>
        <IsLoading text={"Please waiting your while processing"}></IsLoading>
      </div>
    ) : (
      ""
    );
  } else {
    return (
      <div>
        {}

        <Fragment>
          <Navbar onAuthData={handleAuthForRoles} />
          <PageTitle pageTitle={t("Instructor")} pageSub={"CourseDetail"} />
          {chooseVideo ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "60%",
                margin: "0 auto",
              }}
            >
              <VideoPage />
              <button onClick={closeVideo}>Close Video</button>
            </div>
          ) : (
            ""
          )}

          {modal ? (
            <CustomModal
              props={modal}
              changeVideoObject={videoDetail}
              type={title}
              onData={handleFromChildData}
            />
          ) : (
            ""
          )}

          {evaluateModal ? (
            <EvaluateModal
              props={evaluateModal}
              status={data}
              onData={handleSendEvaluate}
            ></EvaluateModal>
          ) : (
            ""
          )}
          <div>
            <div className="row">
              <div className="col">
                <Button onClick={handleOpen}>{t("Create New Section")}</Button>

                {renderButton()}
              </div>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <div className="col">
                    <div className="row">
                      <Input
                        type="text"
                        placeholder="Section Name"
                        onChange={(e) =>
                          setSectionModel({
                            ...sectionModel,
                            sectionName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="row">
                      <Input
                        type="text"
                        placeholder="Description"
                        onChange={(e) =>
                          setSectionModel({
                            ...sectionModel,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <Button onClick={createSection}>Save Section</Button>
                </Typography>
              </Box>
            </Modal>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-sections">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {sections.map((section, index) => (
                    <Draggable
                      key={section.sectionId}
                      draggableId={section.sectionId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Accordion>
                            <Accordion.Item
                              eventKey={section.sectionId}
                              key={section.sectionId}
                            >
                              <Accordion.Header
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <input
                                  defaultValue={section.sectionName}
                                  disabled={
                                    editingSectionId !== section.sectionId
                                  }
                                  onChange={(e) =>
                                    setSectionModel({
                                      ...sectionModel,
                                      sectionName: e.target.value,
                                    })
                                  }
                                />{" "}
                                -
                                <input
                                  defaultValue={section.description}
                                  onChange={(e) =>
                                    setSectionModel({
                                      ...sectionModel,
                                      description: e.target.value,
                                    })
                                  }
                                  disabled={
                                    editingSectionId !== section.sectionId
                                  }
                                />
                                <a
                                  onClick={() =>
                                    handleClickEdit(section.sectionId)
                                  }
                                  onMouseEnter={() => {
                                    setSectionModel({
                                      ...sectionModel,
                                      description: section.description,
                                      sectionName: section.sectionName,
                                    });
                                  }}
                                >
                                  <IoPencil />
                                </a>
                                {editingSectionId === section.sectionId && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() => {
                                      handleUpdateSection(section.sectionId);
                                    }}
                                  >
                                    update
                                  </button>
                                )}
                                <button
                                  style={{ marginLeft: "auto" }}
                                  onClick={() =>
                                    removeItem(section.sectionId, "section")
                                  }
                                  className="btn btn-danger"
                                >
                                  {t("Remove Section")}
                                </button>
                                <button
                                  style={{ marginLeft: "auto" }}
                                  data-target={section.sectionId}
                                  onClick={() => {
                                    setVideoDetail({
                                      publicVideoId: "",
                                      sectionId: section.sectionId,
                                    });
                                    handleOpenCustomModal("NewVideo");
                                  }}
                                  className="btn btn-secondary"
                                >
                                  {t("Add Video")}
                                </button>
                              </Accordion.Header>

                              {section.videos.map((video, key) => (
                                <Accordion.Body key={key}>
                                  <div key={key}>
                                    <a>
                                      <strong>
                                        <a>
                                          <input
                                            ref={inputRef}
                                            disabled={
                                              selectedVideoId !== video.videoId
                                            }
                                            onChange={(e) =>
                                              setRowNumber(e.target.value)
                                            }
                                            defaultValue={
                                              video.rowNumberForSection
                                            }
                                          />
                                          <button
                                            id={video.videoId}
                                            className="btn btn-warning"
                                            onClick={() =>
                                              handleClickedVideo(video.videoId)
                                            }
                                          >
                                            {" "}
                                            {handleClickedUpdateRows &&
                                            selectedVideoId === video.videoId
                                              ? "İptal"
                                              : "Sıra Değiştir"}{" "}
                                          </button>{" "}
                                          ----- {video.title}
                                          {handleClickedUpdateRows &&
                                          selectedVideoId === video.videoId ? (
                                            <button
                                              className="btn btn-success"
                                              onClick={() =>
                                                handleUpdateVideo(video.videoId)
                                              }
                                            >
                                              Save Changes
                                            </button>
                                          ) : (
                                            ""
                                          )}
                                          <button
                                            className="btn border-t-indigo-800"
                                            onClick={() =>
                                              handleClickWatchingVideo(
                                                video.publicVideoId
                                              )
                                            }
                                          >
                                            Watching Video
                                          </button>
                                          <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                              setVideoDetail({
                                                publicVideoId:
                                                  video.publicVideoId,
                                                sectionId: section.sectionId,
                                                rowNumber:
                                                  video.rowNumberForSection,
                                                videoName: video.title,
                                              });
                                              handleOpenCustomModal(
                                                "ChangeVideo"
                                              );
                                            }}
                                          >
                                            Change Video
                                          </button>
                                          <a
                                            onClick={() =>
                                              removeItem(
                                                video.publicVideoId,
                                                "video"
                                              )
                                            }
                                          >
                                            <CiCircleRemove color="red">
                                              Remove
                                            </CiCircleRemove>
                                          </a>
                                        </a>
                                      </strong>
                                      <hr />
                                      <div style={{ position: "relative" }}>
                                        <a>
                                          {video.materials.length > 0 ? (
                                            video.materials.map(
                                              (material, key) => (
                                                <a key={key}>
                                                  {material.name}
                                                  <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                      clickDownloadFile(
                                                        material.fileUrl
                                                      )
                                                    }
                                                  >
                                                    download
                                                  </button>
                                                  <button
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                      handleRemoveFile(
                                                        material.fileUrl
                                                      )
                                                    }
                                                  >
                                                    remove
                                                  </button>
                                                </a>
                                              )
                                            )
                                          ) : (
                                            <button
                                              className="btn btn-warning"
                                              id="newMaterialButton"
                                              ref={buttonRef}
                                              data-value={video.videoId}
                                              onClick={() => {
                                                handleOpenCustomModal(
                                                  "NewMaterial"
                                                );
                                                setVideoId(video?.videoId);
                                              }}
                                            >
                                              Add Material
                                            </button>
                                          )}
                                        </a>
                                      </div>
                                    </a>
                                  </div>

                                  <br />
                                  <hr
                                    style={{
                                      backgroundColor: "red",
                                      height: "5px",
                                    }}
                                  />
                                </Accordion.Body>
                              ))}
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Footer />
          <Scrollbar />
        </Fragment>
      </div>
    );
  }
}

export default InstructorAuth(InstructorsCourseDetail);
